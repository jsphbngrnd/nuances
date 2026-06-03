(function () {
  if (!window.DCFUSettings) {
    return;
  }

  const settings = window.DCFUSettings;
  const formStates = new WeakMap();

  function getFormState(form) {
    if (!formStates.has(form)) {
      formStates.set(form, {
        submittingAfterUpload: false,
        uploading: false,
        lastSubmitter: null,
        fieldStates: {},
      });
    }

    return formStates.get(form);
  }

  function parseConfigScripts() {
    return Array.from(document.querySelectorAll(settings.selectors.configScript))
      .map((node) => {
        try {
          return JSON.parse(node.textContent || "{}");
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);
  }

  function normalizeExtensions(extensions) {
    if (Array.isArray(extensions)) {
      return extensions
        .map((extension) => String(extension || "").trim().replace(/^\./, "").toLowerCase())
        .filter(Boolean);
    }

    return String(extensions || "")
      .split(",")
      .map((extension) => extension.trim().replace(/^\./, "").toLowerCase())
      .filter(Boolean);
  }

  function formatHelpText(config) {
    if (config.helpText) {
      return config.helpText;
    }

    const extensions = normalizeExtensions(config.allowedExtensions);
    const maxMb = Math.max(1, Math.round(Number(config.maxSizeBytes || 0) / (1024 * 1024)));

    if (!extensions.length) {
      return "";
    }

    return `Types autorises : ${extensions.join(", ")}. Taille max : ${maxMb} MB.`;
  }

  function findForms() {
    return Array.from(document.querySelectorAll(settings.selectors.forms));
  }

  function findFieldWrappers(form) {
    return Array.from(form.querySelectorAll(settings.selectors.fieldWrappers));
  }

  function createLabel(config, originalInput) {
    const labelText =
      config.label ||
      originalInput.getAttribute("placeholder") ||
      originalInput.getAttribute("aria-label") ||
      "";

    if (!labelText) {
      return null;
    }

    const label = document.createElement("label");
    label.className = "dcfu-label";
    label.textContent = labelText;
    return label;
  }

  function setStatus(statusNode, message, type) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message || "";
    statusNode.classList.remove("is-error", "is-success");

    if (type === "error") {
      statusNode.classList.add("is-error");
    }

    if (type === "success") {
      statusNode.classList.add("is-success");
    }
  }

  function disableSubmit(form, disabled) {
    form.querySelectorAll('button[type="submit"], input[type="submit"]').forEach((button) => {
      button.disabled = disabled;
    });
  }

  async function uploadFile(fileInput, config) {
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      throw new Error(settings.messages.noFile);
    }

    const body = new FormData();
    body.append("action", settings.action);
    body.append("nonce", settings.nonce);
    body.append("field_config", JSON.stringify(config));
    body.append("signature", config.signature || "");
    body.append("dcfu_file", file, file.name);

    const response = await fetch(settings.ajaxUrl, {
      method: "POST",
      body,
      credentials: "same-origin",
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch (error) {
      throw new Error(settings.messages.badJson);
    }

    if (!response.ok || !payload.success) {
      throw new Error(payload?.data?.message || settings.messages.failed);
    }

    return payload.data;
  }

  function fileSignature(file) {
    return [file.name, file.size, file.lastModified].join(":");
  }

  function buildUploadField(wrapper, form, config) {
    if (!wrapper || wrapper.dataset.dcfuReady === "1") {
      return;
    }

    const originalInput = wrapper.querySelector("input, textarea, select");

    if (!originalInput) {
      return;
    }

    const state = getFormState(form);
    const fieldKey = String(config.fieldIndex);

    if (!state.fieldStates[fieldKey]) {
      state.fieldStates[fieldKey] = {
        token: "",
        signature: "",
      };
    }

    const fieldState = state.fieldStates[fieldKey];

    const label = createLabel(config, originalInput);
    const helpText = formatHelpText(config);
    const extensions = normalizeExtensions(config.allowedExtensions);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.className = `${originalInput.className || ""} dcfu-input`.trim();
    fileInput.accept = extensions.map((extension) => `.${extension}`).join(",");
    fileInput.required = !!config.required;
    fileInput.name = `dcfu_upload_input_${config.formIndex}_${config.fieldIndex}`;

    const hiddenToken = document.createElement("input");
    hiddenToken.type = "hidden";
    hiddenToken.name = `dcfu_upload_tokens[${config.formIndex}][${config.fieldIndex}]`;

    const help = document.createElement("small");
    help.className = "dcfu-help";
    help.textContent = helpText;

    const status = document.createElement("div");
    status.className = "dcfu-status";
    status.setAttribute("aria-live", "polite");

    wrapper.classList.add("dcfu-field");
    originalInput.remove();

    if (label) {
      wrapper.insertBefore(label, wrapper.firstChild);
    }

    wrapper.appendChild(fileInput);
    wrapper.appendChild(hiddenToken);

    if (helpText) {
      wrapper.appendChild(help);
    }

    wrapper.appendChild(status);

    fileInput.addEventListener("change", () => {
      fieldState.token = "";
      fieldState.signature = "";
      hiddenToken.value = "";

      if (fileInput.files && fileInput.files.length) {
        setStatus(status, "", "");
      } else {
        setStatus(status, settings.messages.removed, "success");
      }
    });

    wrapper.dataset.dcfuReady = "1";
    wrapper.dataset.dcfuFieldIndex = fieldKey;
    wrapper._dcfu = {
      fileInput,
      hiddenToken,
      status,
      config,
      state: fieldState,
    };
  }

  function enhanceForm(form, config) {
    if (!config || !Array.isArray(config.fields) || !config.fields.length) {
      return;
    }

    const wrappers = findFieldWrappers(form);

    config.fields.forEach((fieldConfig) => {
      const wrapper = wrappers[fieldConfig.fieldIndex];
      buildUploadField(wrapper, form, fieldConfig);
    });

    const state = getFormState(form);

    form.addEventListener(
      "click",
      (event) => {
        const target = event.target;

        if (
          target &&
          (target.matches('button[type="submit"]') || target.matches('input[type="submit"]'))
        ) {
          state.lastSubmitter = target;
        }
      },
      true
    );

    if (form.dataset.dcfuSubmitBound === "1") {
      return;
    }

    form.addEventListener(
      "submit",
      async (event) => {
        if (state.submittingAfterUpload) {
          state.submittingAfterUpload = false;
          return;
        }

        const uploadFields = Array.from(form.querySelectorAll(".dcfu-field")).map(
          (node) => node._dcfu
        );

        const pending = uploadFields.filter((field) => {
          const file = field.fileInput.files && field.fileInput.files[0];

          if (!file) {
            field.hiddenToken.value = "";
            field.state.token = "";
            field.state.signature = "";
            return false;
          }

          return field.state.token === "" || field.state.signature !== fileSignature(file);
        });

        if (!pending.length || state.uploading) {
          return;
        }

        event.preventDefault();
        state.uploading = true;
        disableSubmit(form, true);

        try {
          for (const field of pending) {
            setStatus(field.status, settings.messages.uploading, "");

            const result = await uploadFile(field.fileInput, field.config);
            const file = field.fileInput.files && field.fileInput.files[0];

            field.state.token = result.token;
            field.state.signature = file ? fileSignature(file) : "";
            field.hiddenToken.value = result.token;
            setStatus(field.status, settings.messages.ready, "success");
          }

          state.uploading = false;
          disableSubmit(form, false);
          state.submittingAfterUpload = true;

          if (typeof form.requestSubmit === "function") {
            if (state.lastSubmitter) {
              form.requestSubmit(state.lastSubmitter);
            } else {
              form.requestSubmit();
            }
          } else {
            form.submit();
          }
        } catch (error) {
          state.uploading = false;
          disableSubmit(form, false);
          setStatus(
            pending[0] && pending[0].status,
            error.message || settings.messages.failed,
            "error"
          );
        }
      },
      true
    );

    form.dataset.dcfuSubmitBound = "1";
  }

  function init() {
    const forms = findForms();
    const configs = parseConfigScripts();

    configs.forEach((config, index) => {
      if (forms[index]) {
        enhanceForm(forms[index], config);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
