(function () {
  const hooks = window.vendor?.wp?.hooks;

  if (!hooks || !hooks.addFilter) {
    return;
  }

  const __ =
    window.wp?.i18n?.__ ||
    function (text) {
      return text;
    };

  const MODULE_FILTERS = [
    "divi.moduleLibrary.moduleAttributes.divi.contact-form-field",
    "divi.moduleLibrary.moduleAttributes.divi.contact-field",
    "divi.moduleLibrary.moduleAttributes.divi.contact_form_field",
  ];

  const MODULE_NAMES = ["divi/contact-form-field", "divi/contact-field", "divi/contact_form_field"];

  function uploadVisible({ attrs }) {
    return (
      String(
        attrs?.dcfuUseUpload ||
          attrs?.module?.meta?.dcfuUseUpload ||
          attrs?.module?.meta?.adminLabel?.dcfuUseUpload ||
          "off"
      ) === "on"
    );
  }

  function uploadField(label, description, attrName, componentName, extraProps) {
    const visible = attrName === "dcfuUseUpload" ? undefined : uploadVisible;

    return {
      render: true,
      attrName,
      label,
      description,
      features: {
        responsive: false,
        hover: false,
        sticky: false,
      },
      visible,
      component: {
        name: componentName,
        type: "field",
        props: {
          ...(extraProps || {}),
          ...(visible ? { visible } : {}),
        },
      },
    };
  }

  function ensureAttribute(attributes, key, definition) {
    if (!attributes[key]) {
      attributes[key] = definition;
    }
  }

  function appendFields(group, fields) {
    if (!group?.component?.props?.fields) {
      return false;
    }

    Object.assign(group.component.props.fields, fields);
    return true;
  }

  function attachFieldsToKnownGroup(attributes, fields) {
    const candidateGroups = [
      attributes?.module?.settings?.content?.fieldOptions,
      attributes?.module?.settings?.content?.field_options,
      attributes?.module?.settings?.content?.text,
      attributes?.module?.settings?.meta?.adminLabel,
    ];

    for (const group of candidateGroups) {
      if (appendFields(group, fields)) {
        return true;
      }
    }

    return false;
  }

  function extendContactFormField(attributes, metadata) {
    ensureAttribute(attributes, "dcfuUseUpload", {
      type: "string",
      default: "off",
    });
    ensureAttribute(attributes, "dcfuLabel", {
      type: "string",
      default: "",
    });
    ensureAttribute(attributes, "dcfuHelpText", {
      type: "string",
      default: "",
    });
    ensureAttribute(attributes, "dcfuAllowedExtensions", {
      type: "string",
      default: "pdf,doc,docx,jpg,jpeg,png",
    });
    ensureAttribute(attributes, "dcfuMaxSizeMb", {
      type: "string",
      default: "5",
    });
    ensureAttribute(attributes, "dcfuRequired", {
      type: "string",
      default: "off",
    });

    const fields = {
      dcfuUseUpload: uploadField(
        __("Use As File Upload", "divi-contact-file-upload"),
        __("Turns this contact field into a file upload field.", "divi-contact-file-upload"),
        "dcfuUseUpload",
        "divi/select",
        {
          options: {
            off: __("No", "divi-contact-file-upload"),
            on: __("Yes", "divi-contact-file-upload"),
          },
        }
      ),
      dcfuLabel: uploadField(
        __("Displayed Label", "divi-contact-file-upload"),
        __("Optional label shown above the upload field on the front end.", "divi-contact-file-upload"),
        "dcfuLabel",
        "divi/text"
      ),
      dcfuHelpText: uploadField(
        __("Help Text", "divi-contact-file-upload"),
        __("Optional helper text shown below the upload field.", "divi-contact-file-upload"),
        "dcfuHelpText",
        "divi/text"
      ),
      dcfuAllowedExtensions: uploadField(
        __("Allowed File Types", "divi-contact-file-upload"),
        __("Comma-separated extensions, for example: pdf,doc,docx", "divi-contact-file-upload"),
        "dcfuAllowedExtensions",
        "divi/text"
      ),
      dcfuMaxSizeMb: uploadField(
        __("Max File Size (MB)", "divi-contact-file-upload"),
        __("Maximum upload size for this field in megabytes.", "divi-contact-file-upload"),
        "dcfuMaxSizeMb",
        "divi/text"
      ),
      dcfuRequired: uploadField(
        __("Upload Required", "divi-contact-file-upload"),
        __("Require a file before the form can be sent.", "divi-contact-file-upload"),
        "dcfuRequired",
        "divi/select",
        {
          options: {
            off: __("No", "divi-contact-file-upload"),
            on: __("Yes", "divi-contact-file-upload"),
          },
        }
      ),
    };

    attachFieldsToKnownGroup(attributes, fields);

    return attributes;
  }

  function addCompatAdminLabelFields(fieldProps) {
    fieldProps.dcfuUseUpload = {
      attrName: "module.meta.adminLabel.dcfuUseUpload",
      label: __("Use As File Upload", "divi-contact-file-upload"),
      description: __(
        "Enable this only on Contact Form fields that should become upload fields.",
        "divi-contact-file-upload"
      ),
      features: {
        hover: false,
        sticky: false,
        responsive: false,
        preset: "meta",
      },
      render: true,
      groupName: "divi/admin-label",
      component: {
        type: "field",
        name: "divi/select",
        props: {
          options: {
            off: __("No", "divi-contact-file-upload"),
            on: __("Yes", "divi-contact-file-upload"),
          },
        },
      },
    };

    fieldProps.dcfuLabel = {
      attrName: "module.meta.adminLabel.dcfuLabel",
      label: __("Upload Label", "divi-contact-file-upload"),
      description: __("Displayed text above the upload field.", "divi-contact-file-upload"),
      features: {
        hover: false,
        sticky: false,
        responsive: false,
        preset: "meta",
      },
      render: true,
      groupName: "divi/admin-label",
      visible: uploadVisible,
      component: {
        type: "field",
        name: "divi/text",
        props: {
          visible: uploadVisible,
        },
      },
    };

    fieldProps.dcfuHelpText = {
      attrName: "module.meta.adminLabel.dcfuHelpText",
      label: __("Upload Help Text", "divi-contact-file-upload"),
      description: __("Text shown below the upload field.", "divi-contact-file-upload"),
      features: {
        hover: false,
        sticky: false,
        responsive: false,
        preset: "meta",
      },
      render: true,
      groupName: "divi/admin-label",
      visible: uploadVisible,
      component: {
        type: "field",
        name: "divi/text",
        props: {
          visible: uploadVisible,
        },
      },
    };

    fieldProps.dcfuAllowedExtensions = {
      attrName: "module.meta.adminLabel.dcfuAllowedExtensions",
      label: __("Allowed File Types", "divi-contact-file-upload"),
      description: __("Comma-separated extensions, for example: pdf,doc,docx", "divi-contact-file-upload"),
      features: {
        hover: false,
        sticky: false,
        responsive: false,
        preset: "meta",
      },
      render: true,
      groupName: "divi/admin-label",
      visible: uploadVisible,
      component: {
        type: "field",
        name: "divi/text",
        props: {
          visible: uploadVisible,
        },
      },
    };

    fieldProps.dcfuMaxSizeMb = {
      attrName: "module.meta.adminLabel.dcfuMaxSizeMb",
      label: __("Max File Size (MB)", "divi-contact-file-upload"),
      description: __("Maximum upload size for this field in megabytes.", "divi-contact-file-upload"),
      features: {
        hover: false,
        sticky: false,
        responsive: false,
        preset: "meta",
      },
      render: true,
      groupName: "divi/admin-label",
      visible: uploadVisible,
      component: {
        type: "field",
        name: "divi/text",
        props: {
          visible: uploadVisible,
        },
      },
    };

    fieldProps.dcfuRequired = {
      attrName: "module.meta.adminLabel.dcfuRequired",
      label: __("Upload Required", "divi-contact-file-upload"),
      description: __("Require a file before the form can be sent.", "divi-contact-file-upload"),
      features: {
        hover: false,
        sticky: false,
        responsive: false,
        preset: "meta",
      },
      render: true,
      groupName: "divi/admin-label",
      visible: uploadVisible,
      component: {
        type: "field",
        name: "divi/select",
        props: {
          visible: uploadVisible,
          options: {
            off: __("No", "divi-contact-file-upload"),
            on: __("Yes", "divi-contact-file-upload"),
          },
        },
      },
    };

    return fieldProps;
  }

  MODULE_FILTERS.forEach((filterName) => {
    hooks.addFilter(filterName, "dcfu/contact-form-field", extendContactFormField, 20);
  });

  hooks.addFilter(
    "divi.module.options.adminLabel.group.fields",
    "dcfu/admin-label-compat",
    (fieldProps) => addCompatAdminLabelFields(fieldProps),
    20
  );

  hooks.addFilter(
    "divi.moduleGroups.groups",
    "dcfu/contact-form-field-groups",
    (groups, moduleInfo) => {
      if (!MODULE_NAMES.includes(moduleInfo?.moduleName)) {
        return groups;
      }

      if (groups?.content?.fieldOptions?.label) {
        groups.content.fieldOptions.label = __(
          "Field Options + Upload",
          "divi-contact-file-upload"
        );
      }

      if (groups?.content?.field_options?.label) {
        groups.content.field_options.label = __(
          "Field Options + Upload",
          "divi-contact-file-upload"
        );
      }

      return groups;
    },
    20
  );
})();
