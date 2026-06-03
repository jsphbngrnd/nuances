<?php
/**
 * Plugin Name: Divi Contact File Upload
 * Plugin URI:  https://example.com/
 * Description: Adds configurable file upload fields to Divi 5 Contact Form fields and attaches uploaded files to outgoing emails.
 * Version:     0.2.0
 * Author:      Codex
 * License:     GPL-2.0-or-later
 * Text Domain: divi-contact-file-upload
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class DCFU_Plugin {
	const NONCE_ACTION              = 'dcfu_upload';
	const AJAX_ACTION               = 'dcfu_upload';
	const TEMP_TOKEN_PREFIX         = 'dcfu_upload_';
	const UPLOAD_SUBDIR             = 'divi-contact-file-upload/tmp';
	const CLEANUP_HOOK              = 'dcfu_cleanup_temp_uploads';
	const FIELD_CONFIG_CLASS        = 'dcfu-form-config';
	const HIDDEN_TOKEN_INPUT_PREFIX = 'dcfu_upload_tokens';
	const SIGNING_CONTEXT           = 'dcfu_upload_signature';

	/**
	 * Contact Form block names seen in Divi 5.
	 *
	 * @var string[]
	 */
	private static $contact_form_block_names = array(
		'divi/contact-form',
		'divi/contact_form',
	);

	/**
	 * Contact Form child field block names seen in Divi 5.
	 *
	 * @var string[]
	 */
	private static $contact_form_field_block_names = array(
		'divi/contact-form-field',
		'divi/contact_form_field',
		'divi/contact-field',
		'divi/contact_field',
	);

	/**
	 * Tokens already attached during the current request.
	 *
	 * @var array<string, bool>
	 */
	private static $consumed_tokens = array();

	/**
	 * Incremental index used to pair rendered forms with their front-end config.
	 *
	 * @var int
	 */
	private static $rendered_form_index = 0;

	/**
	 * Whether the current upload operation should override the upload directory.
	 *
	 * @var bool
	 */
	private static $filtering_upload_dir = false;

	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_front_assets' ) );
		add_action( 'divi_visual_builder_assets_before_enqueue_scripts', array( __CLASS__, 'enqueue_builder_assets' ) );
		add_action( 'wp_ajax_' . self::AJAX_ACTION, array( __CLASS__, 'handle_upload' ) );
		add_action( 'wp_ajax_nopriv_' . self::AJAX_ACTION, array( __CLASS__, 'handle_upload' ) );
		add_filter( 'render_block', array( __CLASS__, 'inject_form_config' ), 10, 2 );
		add_filter( 'wp_mail', array( __CLASS__, 'attach_files_to_mail' ), 50 );
		add_action( 'wp_mail_succeeded', array( __CLASS__, 'cleanup_sent_mail_uploads' ) );
		add_action( 'wp_mail_failed', array( __CLASS__, 'cleanup_failed_mail_uploads' ) );
		add_action( self::CLEANUP_HOOK, array( __CLASS__, 'cleanup_stale_uploads' ) );
	}

	public static function activate() {
		if ( ! wp_next_scheduled( self::CLEANUP_HOOK ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', self::CLEANUP_HOOK );
		}
	}

	public static function deactivate() {
		$timestamp = wp_next_scheduled( self::CLEANUP_HOOK );

		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::CLEANUP_HOOK );
		}
	}

	public static function enqueue_front_assets() {
		if ( is_admin() ) {
			return;
		}

		$version = '0.2.0';

		wp_enqueue_style(
			'dcfu-style',
			plugin_dir_url( __FILE__ ) . 'assets/divi-contact-file-upload.css',
			array(),
			$version
		);

		wp_enqueue_script(
			'dcfu-script',
			plugin_dir_url( __FILE__ ) . 'assets/divi-contact-file-upload.js',
			array(),
			$version,
			true
		);

		wp_localize_script(
			'dcfu-script',
			'DCFUSettings',
			array(
				'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( self::NONCE_ACTION ),
				'action'   => self::AJAX_ACTION,
				'selectors' => array(
					'forms'        => '.et_pb_contact_form form, .et_pb_contact_form_container form',
					'fieldWrappers' => '.et_pb_contact_field',
					'configScript' => '.' . self::FIELD_CONFIG_CLASS,
				),
				'messages' => array(
					'uploading' => __( 'Uploading attachment...', 'divi-contact-file-upload' ),
					'ready'     => __( 'Attachment ready.', 'divi-contact-file-upload' ),
					'removed'   => __( 'Attachment removed.', 'divi-contact-file-upload' ),
					'failed'    => __( 'Attachment upload failed. Please try again.', 'divi-contact-file-upload' ),
					'noFile'    => __( 'Please choose a file.', 'divi-contact-file-upload' ),
					'badJson'   => __( 'The upload configuration is invalid.', 'divi-contact-file-upload' ),
				),
			)
		);
	}

	public static function enqueue_builder_assets() {
		if ( ! function_exists( 'et_builder_d5_enabled' ) || ! function_exists( 'et_core_is_fb_enabled' ) ) {
			return;
		}

		if ( ! et_builder_d5_enabled() || ! et_core_is_fb_enabled() ) {
			return;
		}

		if ( ! class_exists( '\ET\Builder\VisualBuilder\Assets\PackageBuildManager' ) ) {
			return;
		}

		\ET\Builder\VisualBuilder\Assets\PackageBuildManager::register_package_build(
			array(
				'name'    => 'dcfu-divi5-builder',
				'version' => '0.2.0',
				'script'  => array(
					'src'                => plugin_dir_url( __FILE__ ) . 'assets/divi-contact-file-upload-builder.js',
					'deps'               => array(
						'lodash',
						'divi-vendor-wp-hooks',
						'wp-i18n',
					),
					'enqueue_top_window' => false,
					'enqueue_app_window' => true,
					'args'               => array(
						'in_footer' => false,
					),
				),
			)
		);
	}

	public static function inject_form_config( $block_content, $block ) {
		$block_name = $block['blockName'] ?? '';

		if ( ! in_array( $block_name, self::$contact_form_block_names, true ) ) {
			return $block_content;
		}

		$field_configs = self::collect_upload_field_configs( $block['innerBlocks'] ?? array() );

		if ( empty( $field_configs ) ) {
			return $block_content;
		}

		$form_index = self::$rendered_form_index++;
		$payload    = array(
			'formIndex' => $form_index,
			'fields'    => array(),
		);

		foreach ( $field_configs as $field_config ) {
			$field_config['formIndex'] = $form_index;
			$field_config['signature'] = self::sign_field_config( $field_config );
			$payload['fields'][]       = $field_config;
		}

		return $block_content . "\n" . sprintf(
			'<script type="application/json" class="%1$s">%2$s</script>',
			esc_attr( self::FIELD_CONFIG_CLASS ),
			wp_json_encode( $payload )
		);
	}

	public static function handle_upload() {
		check_ajax_referer( self::NONCE_ACTION, 'nonce' );

		if ( empty( $_POST['field_config'] ) || empty( $_POST['signature'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'The upload configuration is missing.', 'divi-contact-file-upload' ),
				),
				400
			);
		}

		$field_config = json_decode( wp_unslash( $_POST['field_config'] ), true );
		$signature    = sanitize_text_field( wp_unslash( $_POST['signature'] ) );

		if ( ! is_array( $field_config ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'The upload configuration is invalid.', 'divi-contact-file-upload' ),
				),
				400
			);
		}

		$field_config = self::normalize_field_config_for_signature( $field_config );

		if ( empty( $field_config ) || ! hash_equals( self::sign_field_config( $field_config ), $signature ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'The upload configuration could not be verified.', 'divi-contact-file-upload' ),
				),
				403
			);
		}

		if ( empty( $_FILES['dcfu_file'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'No file was received.', 'divi-contact-file-upload' ),
				),
				400
			);
		}

		$file = $_FILES['dcfu_file'];

		if ( ! empty( $file['error'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'The uploaded file could not be processed.', 'divi-contact-file-upload' ),
				),
				400
			);
		}

		if ( (int) $file['size'] > (int) $field_config['maxSizeBytes'] ) {
			wp_send_json_error(
				array(
					'message' => sprintf(
						/* translators: %s: maximum file size in megabytes. */
						__( 'Each file must be %s MB or smaller.', 'divi-contact-file-upload' ),
						self::format_megabytes( (int) $field_config['maxSizeBytes'] )
					),
				),
				400
			);
		}

		$allowed_extensions = self::normalize_allowed_extensions( $field_config['allowedExtensions'] );
		$extension          = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );

		if ( empty( $allowed_extensions ) || ! in_array( $extension, $allowed_extensions, true ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'That file type is not allowed for this field.', 'divi-contact-file-upload' ),
				),
				400
			);
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';

		self::$filtering_upload_dir = true;
		add_filter( 'upload_dir', array( __CLASS__, 'filter_upload_dir' ) );

		$upload = wp_handle_upload(
			$file,
			array(
				'test_form' => false,
				'mimes'     => self::get_allowed_mimes( $allowed_extensions ),
			)
		);

		remove_filter( 'upload_dir', array( __CLASS__, 'filter_upload_dir' ) );
		self::$filtering_upload_dir = false;

		if ( isset( $upload['error'] ) ) {
			wp_send_json_error(
				array(
					'message' => $upload['error'],
				),
				400
			);
		}

		$token = self::generate_token();

		set_transient(
			self::TEMP_TOKEN_PREFIX . $token,
			array(
				'files' => array(
					array(
						'file'          => $upload['file'],
						'url'           => $upload['url'],
						'type'          => $upload['type'],
						'original_name' => sanitize_file_name( $file['name'] ),
					),
				),
			),
			HOUR_IN_SECONDS
		);

		wp_send_json_success(
			array(
				'token' => $token,
				'file'  => array(
					'name' => sanitize_file_name( $file['name'] ),
					'url'  => $upload['url'],
				),
			)
		);
	}

	public static function filter_upload_dir( $dirs ) {
		if ( ! self::$filtering_upload_dir ) {
			return $dirs;
		}

		$subdir         = '/' . trim( self::UPLOAD_SUBDIR, '/' );
		$dirs['path']   = $dirs['basedir'] . $subdir;
		$dirs['url']    = $dirs['baseurl'] . $subdir;
		$dirs['subdir'] = $subdir;

		return $dirs;
	}

	public static function attach_files_to_mail( $args ) {
		$tokens = self::get_request_tokens();

		if ( empty( $tokens ) ) {
			return $args;
		}

		$attachments = empty( $args['attachments'] ) ? array() : (array) $args['attachments'];

		foreach ( $tokens as $token ) {
			if ( isset( self::$consumed_tokens[ $token ] ) ) {
				continue;
			}

			$data = get_transient( self::TEMP_TOKEN_PREFIX . $token );

			if ( empty( $data['files'] ) || ! is_array( $data['files'] ) ) {
				continue;
			}

			foreach ( $data['files'] as $file ) {
				if ( ! empty( $file['file'] ) && is_readable( $file['file'] ) ) {
					$attachments[] = $file['file'];
				}
			}

			self::$consumed_tokens[ $token ] = true;
		}

		$args['attachments'] = array_values( array_unique( $attachments ) );

		return $args;
	}

	public static function cleanup_sent_mail_uploads() {
		foreach ( array_keys( self::$consumed_tokens ) as $token ) {
			self::cleanup_token( $token );
		}
	}

	public static function cleanup_failed_mail_uploads() {
		foreach ( array_keys( self::$consumed_tokens ) as $token ) {
			self::cleanup_token( $token );
		}
	}

	public static function cleanup_stale_uploads() {
		$upload_dir = wp_upload_dir();
		$directory  = trailingslashit( $upload_dir['basedir'] ) . trim( self::UPLOAD_SUBDIR, '/' );

		if ( ! is_dir( $directory ) ) {
			return;
		}

		$files = glob( $directory . '/*' );

		if ( empty( $files ) ) {
			return;
		}

		$expiry = time() - DAY_IN_SECONDS;

		foreach ( $files as $file ) {
			if ( is_file( $file ) && filemtime( $file ) < $expiry ) {
				wp_delete_file( $file );
			}
		}
	}

	private static function collect_upload_field_configs( $blocks ) {
		$field_index = 0;
		$configs     = array();

		self::walk_contact_form_blocks( $blocks, $field_index, $configs );

		return $configs;
	}

	private static function walk_contact_form_blocks( $blocks, &$field_index, &$configs ) {
		foreach ( $blocks as $block ) {
			$block_name = $block['blockName'] ?? '';
			$attrs      = $block['attrs'] ?? array();

			if ( in_array( $block_name, self::$contact_form_field_block_names, true ) ) {
					$is_upload = self::normalize_toggle(
						self::get_block_attr_value(
							$attrs,
							array(
								array( 'dcfuUseUpload' ),
								array( 'module', 'meta', 'dcfuUseUpload' ),
								array( 'module', 'meta', 'adminLabel', 'dcfuUseUpload' ),
							),
							'off'
						)
					);

				if ( 'on' === $is_upload ) {
					$allowed_extensions = self::normalize_allowed_extensions(
						self::get_block_attr_value(
							$attrs,
							array(
								array( 'dcfuAllowedExtensions' ),
								array( 'module', 'meta', 'dcfuAllowedExtensions' ),
								array( 'module', 'meta', 'adminLabel', 'dcfuAllowedExtensions' ),
							),
							'pdf,doc,docx,jpg,jpeg,png'
						)
					);

					$max_size_bytes = self::normalize_max_size_bytes(
						self::get_block_attr_value(
							$attrs,
							array(
								array( 'dcfuMaxSizeMb' ),
								array( 'module', 'meta', 'dcfuMaxSizeMb' ),
								array( 'module', 'meta', 'adminLabel', 'dcfuMaxSizeMb' ),
							),
							5
						)
					);

					$label = self::sanitize_text_setting(
						self::get_block_attr_value(
							$attrs,
							array(
								array( 'dcfuLabel' ),
								array( 'module', 'meta', 'dcfuLabel' ),
								array( 'module', 'meta', 'adminLabel', 'dcfuLabel' ),
								array( 'title' ),
								array( 'field_title' ),
							),
							''
						)
					);

					$help_text = self::sanitize_text_setting(
						self::get_block_attr_value(
							$attrs,
							array(
								array( 'dcfuHelpText' ),
								array( 'module', 'meta', 'dcfuHelpText' ),
								array( 'module', 'meta', 'adminLabel', 'dcfuHelpText' ),
							),
							''
						)
					);

					$required = self::normalize_toggle(
						self::get_block_attr_value(
							$attrs,
							array(
								array( 'dcfuRequired' ),
								array( 'module', 'meta', 'dcfuRequired' ),
								array( 'module', 'meta', 'adminLabel', 'dcfuRequired' ),
								array( 'required_mark' ),
								array( 'required' ),
							),
							'off'
						)
					);

					$configs[] = array(
						'fieldIndex'        => $field_index,
						'label'             => $label,
						'helpText'          => $help_text,
						'allowedExtensions' => $allowed_extensions,
						'maxSizeBytes'      => $max_size_bytes,
						'required'          => ( 'on' === $required ),
					);
				}

				$field_index++;
			}

			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				self::walk_contact_form_blocks( $block['innerBlocks'], $field_index, $configs );
			}
		}
	}

	private static function get_block_attr_value( $attrs, $paths, $default = '' ) {
		foreach ( $paths as $path ) {
			$value = self::get_path_value( $attrs, $path );

			if ( null === $value ) {
				continue;
			}

			$value = self::unwrap_attr_value( $value );

			if ( '' !== $value && null !== $value ) {
				return $value;
			}
		}

		return $default;
	}

	private static function get_path_value( $source, $path ) {
		$current = $source;

		foreach ( $path as $segment ) {
			if ( ! is_array( $current ) || ! array_key_exists( $segment, $current ) ) {
				return null;
			}

			$current = $current[ $segment ];
		}

		return $current;
	}

	private static function unwrap_attr_value( $value ) {
		if ( ! is_array( $value ) ) {
			return $value;
		}

		if ( isset( $value['desktop']['value'] ) ) {
			return self::unwrap_attr_value( $value['desktop']['value'] );
		}

		if ( isset( $value['value'] ) ) {
			return self::unwrap_attr_value( $value['value'] );
		}

		return $value;
	}

	private static function normalize_field_config_for_signature( $config ) {
		if ( ! is_array( $config ) ) {
			return array();
		}

		return array(
			'formIndex'         => max( 0, (int) ( $config['formIndex'] ?? 0 ) ),
			'fieldIndex'        => max( 0, (int) ( $config['fieldIndex'] ?? 0 ) ),
			'allowedExtensions' => self::normalize_allowed_extensions( $config['allowedExtensions'] ?? array() ),
			'maxSizeBytes'      => self::normalize_max_size_bytes( $config['maxSizeBytes'] ?? 5 * MB_IN_BYTES ),
			'required'          => ! empty( $config['required'] ),
		);
	}

	private static function sign_field_config( $config ) {
		return hash_hmac(
			'sha256',
			wp_json_encode( self::normalize_field_config_for_signature( $config ) ),
			wp_salt( self::SIGNING_CONTEXT )
		);
	}

	private static function get_request_tokens() {
		if ( empty( $_POST[ self::HIDDEN_TOKEN_INPUT_PREFIX ] ) ) {
			return array();
		}

		return self::flatten_tokens( wp_unslash( $_POST[ self::HIDDEN_TOKEN_INPUT_PREFIX ] ) );
	}

	private static function flatten_tokens( $value ) {
		$tokens = array();

		if ( is_array( $value ) ) {
			foreach ( $value as $item ) {
				$tokens = array_merge( $tokens, self::flatten_tokens( $item ) );
			}

			return array_values( array_unique( array_filter( $tokens ) ) );
		}

		$token = self::sanitize_token( $value );

		return $token ? array( $token ) : array();
	}

	private static function cleanup_token( $token ) {
		$data = get_transient( self::TEMP_TOKEN_PREFIX . $token );

		if ( ! empty( $data['files'] ) && is_array( $data['files'] ) ) {
			foreach ( $data['files'] as $file ) {
				if ( ! empty( $file['file'] ) && is_file( $file['file'] ) ) {
					wp_delete_file( $file['file'] );
				}
			}
		}

		delete_transient( self::TEMP_TOKEN_PREFIX . $token );
		unset( self::$consumed_tokens[ $token ] );
	}

	private static function normalize_allowed_extensions( $raw_extensions ) {
		$extensions = array();

		if ( is_string( $raw_extensions ) ) {
			$raw_extensions = explode( ',', $raw_extensions );
		}

		foreach ( (array) $raw_extensions as $extension ) {
			$extension = strtolower( trim( ltrim( (string) $extension, '.' ) ) );

			if ( '' !== $extension ) {
				$extensions[] = $extension;
			}
		}

		return array_values( array_unique( $extensions ) );
	}

	private static function get_allowed_mimes( $extensions ) {
		$allowed = array();

		foreach ( get_allowed_mime_types() as $ext_group => $mime ) {
			$candidates = array_map( 'strtolower', explode( '|', $ext_group ) );

			if ( array_intersect( $extensions, $candidates ) ) {
				$allowed[ $ext_group ] = $mime;
			}
		}

		return $allowed;
	}

	private static function normalize_max_size_bytes( $raw_value ) {
		$value = is_numeric( $raw_value ) ? (float) $raw_value : 5;

		// Interpret small values as megabytes and larger values as bytes.
		if ( $value <= 256 ) {
			$value *= MB_IN_BYTES;
		}

		return max( MB_IN_BYTES, (int) round( $value ) );
	}

	private static function sanitize_text_setting( $value ) {
		return sanitize_text_field( (string) $value );
	}

	private static function normalize_toggle( $value ) {
		$value = strtolower( trim( (string) $value ) );

		return in_array( $value, array( 'on', 'yes', 'true', '1' ), true ) ? 'on' : 'off';
	}

	private static function sanitize_token( $token ) {
		return preg_replace( '/[^a-zA-Z0-9]/', '', (string) $token );
	}

	private static function generate_token() {
		return wp_generate_password( 24, false, false );
	}

	private static function format_megabytes( $bytes ) {
		return number_format_i18n( $bytes / MB_IN_BYTES, 0 );
	}
}

DCFU_Plugin::init();
register_activation_hook( __FILE__, array( 'DCFU_Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'DCFU_Plugin', 'deactivate' ) );
