<?php

declare(strict_types=1);

$mysqli = mysqli_init();
if (! $mysqli) {
    fwrite(STDERR, "Failed to initialize MySQLi.\n");
    exit(1);
}

$socket = '/Users/benjamincaron/Library/Application Support/Local/run/scEvLs8pJ/mysql/mysqld.sock';
if (! $mysqli->real_connect(null, 'root', 'root', 'local', null, $socket)) {
    fwrite(STDERR, "Database connection failed: " . mysqli_connect_error() . "\n");
    exit(1);
}

$mysqli->set_charset('utf8mb4');

function ensure_meta(mysqli $mysqli, int $postId, string $key, string $value): void
{
    $k = $mysqli->real_escape_string($key);
    $v = $mysqli->real_escape_string($value);
    $res = $mysqli->query("SELECT meta_id FROM mod543_postmeta WHERE post_id={$postId} AND meta_key='{$k}' LIMIT 1");
    if ($res && $res->num_rows > 0) {
        $mysqli->query("UPDATE mod543_postmeta SET meta_value='{$v}' WHERE post_id={$postId} AND meta_key='{$k}'");
    } else {
        $mysqli->query("INSERT INTO mod543_postmeta (post_id, meta_key, meta_value) VALUES ({$postId}, '{$k}', '{$v}')");
    }
}

function find_menu_item(mysqli $mysqli, string $title, int $parentId): ?int
{
    $titleEsc = $mysqli->real_escape_string($title);
    $sql = "SELECT p.ID
        FROM mod543_posts p
        JOIN mod543_postmeta pm ON pm.post_id = p.ID AND pm.meta_key = '_menu_item_menu_item_parent'
        WHERE p.post_type='nav_menu_item'
          AND p.post_status='publish'
          AND p.post_title='{$titleEsc}'
          AND pm.meta_value='{$parentId}'
        LIMIT 1";
    $res = $mysqli->query($sql);
    if ($res && ($row = $res->fetch_assoc())) {
        return (int) $row['ID'];
    }
    return null;
}

function add_menu_item(mysqli $mysqli, int $menuTermTaxonomyId, string $title, string $url, int $parentId, int $menuOrder): int
{
    if ($existing = find_menu_item($mysqli, $title, $parentId)) {
        $titleEsc = $mysqli->real_escape_string($title);
        $urlEsc = $mysqli->real_escape_string($url);
        $mysqli->query("UPDATE mod543_posts SET post_title='{$titleEsc}', menu_order={$menuOrder}, post_modified=NOW(), post_modified_gmt=UTC_TIMESTAMP() WHERE ID={$existing}");
        ensure_meta($mysqli, $existing, '_menu_item_url', $url);
        ensure_meta($mysqli, $existing, '_menu_item_menu_item_parent', (string) $parentId);
        return $existing;
    }

    $titleEsc = $mysqli->real_escape_string($title);
    $slug = sanitize_title($title);
    $slugEsc = $mysqli->real_escape_string($slug);
    $now = date('Y-m-d H:i:s');
    $guid = '?post_type=nav_menu_item&p=';

    $mysqli->query("
        INSERT INTO mod543_posts (
            post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
            post_status, comment_status, ping_status, post_password, post_name, to_ping,
            pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent,
            guid, menu_order, post_type, post_mime_type, comment_count
        ) VALUES (
            1, '{$now}', UTC_TIMESTAMP(), '', '{$titleEsc}', '',
            'publish', 'closed', 'closed', '', '{$slugEsc}', '',
            '', '{$now}', UTC_TIMESTAMP(), '', 0,
            '{$guid}', {$menuOrder}, 'nav_menu_item', '', 0
        )
    ");

    $postId = (int) $mysqli->insert_id;
    $guidEsc = $mysqli->real_escape_string($guid . $postId);
    $mysqli->query("UPDATE mod543_posts SET guid='{$guidEsc}' WHERE ID={$postId}");
    $mysqli->query("INSERT IGNORE INTO mod543_term_relationships (object_id, term_taxonomy_id, term_order) VALUES ({$postId}, {$menuTermTaxonomyId}, 0)");

    ensure_meta($mysqli, $postId, '_menu_item_type', 'custom');
    ensure_meta($mysqli, $postId, '_menu_item_menu_item_parent', (string) $parentId);
    ensure_meta($mysqli, $postId, '_menu_item_object_id', (string) $postId);
    ensure_meta($mysqli, $postId, '_menu_item_object', 'custom');
    ensure_meta($mysqli, $postId, '_menu_item_target', '');
    ensure_meta($mysqli, $postId, '_menu_item_classes', 'a:1:{i:0;s:0:"";}');
    ensure_meta($mysqli, $postId, '_menu_item_xfn', '');
    ensure_meta($mysqli, $postId, '_menu_item_url', $url);

    return $postId;
}

function sanitize_title(string $title): string
{
    $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $title);
    $value = strtolower((string) $value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    return trim((string) $value, '-');
}

$menuTtid = 3;
$parents = [
    'Nous protégeons' => 45,
    'Le Cabinet' => 46,
    'Contact' => 47,
];

$items = [
    ['title' => "L'Entreprise", 'url' => '/entreprise', 'parent' => $parents['Nous protégeons']],
    ['title' => 'Le Patrimoine', 'url' => '/patrimoine', 'parent' => $parents['Nous protégeons']],
    ['title' => "L'Individu", 'url' => '/individu', 'parent' => $parents['Nous protégeons']],
    ['title' => 'Le cabinet', 'url' => '/cabinet', 'parent' => $parents['Le Cabinet']],
    ['title' => 'Notre méthode', 'url' => '/cabinet/notre-methode', 'parent' => $parents['Le Cabinet']],
    ['title' => "L'équipe", 'url' => '/cabinet/equipe', 'parent' => $parents['Le Cabinet']],
    ['title' => 'Travailler en entourage', 'url' => '/cabinet/travailler-en-entourage', 'parent' => $parents['Le Cabinet']],
    ['title' => 'Contact', 'url' => '/contact', 'parent' => $parents['Contact']],
    ['title' => 'Prendre rendez-vous', 'url' => '/contact', 'parent' => $parents['Contact']],
];

$order = 1;
foreach ($items as $item) {
    add_menu_item($mysqli, $menuTtid, $item['title'], $item['url'], $item['parent'], $order);
    $order++;
}

echo "Synced " . count($items) . " menu items.\n";
