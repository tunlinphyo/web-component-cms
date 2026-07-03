import { LitElement, html } from "lit";
import { FEATURES, isFeatureEnabled } from "../../../registries/formatter-registry.js";
import "../controls/quill/index.js";

const FORMATTERS = [
  "element-type-selector",
  "format-font-family",
  "format-font-size",
  "format-bold",
  "format-italic",
  "format-underline",
  "format-ordered-list",
  "format-unordered-list",
  "format-align-left",
  "format-align-center",
  "format-align-right",
  "format-align-justify",
  "format-highlight",
  "format-link",
  "format-link-target",
  "format-text-color",
  "format-text-color-palette",
  "format-icon-background-color",
  "image-background-color",
  "image-border-width",
  "image-border-color",
  "image-border-style",
  "image-border-position",
  "image-border-radius",
  "format-image-object-fit",
  "format-image-link",
  "format-image-link-target",
  "format-disabled",
  "format-button-design",
  "format-button-icon-placement",
  "format-button-link",
  "format-button-link-target",
  "format-table-headers",
  "table-header-background-color",
  "table-body-background-color",
  "table-border-width",
  "table-border-color",
  "table-border-style",
  "table-border-position",
];

const TEXT_FORMATTERS = [
  "element-type-selector",
  "format-font-family",
  "format-font-size",
  "format-bold",
  "format-italic",
  "format-underline",
  "format-ordered-list",
  "format-unordered-list",
  "format-highlight",
  "format-link",
  "format-link-target",
  "format-text-color",
  "format-text-color-palette",
];

const INLINE_FORMATTERS = [
  ["format-font-size", "fontSizeApplied"],
  ["format-bold", "bold"],
  ["format-italic", "italic"],
  ["format-underline", "underline"],
  ["format-highlight", "highlight"],
  ["format-link", "link"],
  ["format-text-color", "colorApplied"],
  ["format-text-color-palette", "colorApplied"],
];

const QUILL_FORMATTERS = [
  "quill-element-type-selector",
  "quill-format-font-family",
  "quill-format-font-size",
  "quill-format-bold",
  "quill-format-italic",
  "quill-format-underline",
  "quill-format-ordered-list",
  "quill-format-unordered-list",
  "quill-format-align-left",
  "quill-format-align-center",
  "quill-format-align-right",
  "quill-format-align-justify",
  "quill-format-highlight",
  "quill-format-link",
  "quill-format-link-target",
  "quill-format-text-color",
  "quill-format-text-color-palette",
];

const FORMATTER_FEATURES = {
  "element-type-selector": FEATURES.type,
  "format-font-family": FEATURES.fontFamily,
  "format-font-size": FEATURES.fontSize,
  "format-bold": FEATURES.bold,
  "format-italic": FEATURES.italic,
  "format-underline": FEATURES.underline,
  "format-ordered-list": FEATURES.orderedList,
  "format-unordered-list": FEATURES.unorderedList,
  "format-align-left": FEATURES.align,
  "format-align-center": FEATURES.align,
  "format-align-right": FEATURES.align,
  "format-align-justify": FEATURES.align,
  "format-highlight": FEATURES.backgroundColor,
  "format-link": FEATURES.link,
  "format-link-target": FEATURES.linkTarget,
  "format-text-color": FEATURES.color,
  "format-text-color-palette": FEATURES.color,
  "format-icon-background-color": FEATURES.backgroundColor,
  "image-background-color": FEATURES.backgroundColor,
  "image-border-width": FEATURES.border,
  "image-border-color": FEATURES.border,
  "image-border-style": FEATURES.border,
  "image-border-position": FEATURES.border,
  "image-border-radius": FEATURES.borderRadius,
  "format-image-object-fit": FEATURES.objectFit,
  "format-image-link": FEATURES.link,
  "format-image-link-target": FEATURES.linkTarget,
  "format-disabled": FEATURES.disabled,
  "format-button-design": FEATURES.buttonDesign,
  "format-button-icon-placement": FEATURES.icon,
  "format-button-link": FEATURES.link,
  "format-button-link-target": FEATURES.linkTarget,
  "format-table-headers": FEATURES.tableHeaders,
  "table-header-background-color": FEATURES.backgroundColor,
  "table-body-background-color": FEATURES.backgroundColor,
  "table-border-width": FEATURES.border,
  "table-border-color": FEATURES.border,
  "table-border-style": FEATURES.border,
  "table-border-position": FEATURES.border,
  "quill-element-type-selector": FEATURES.type,
  "quill-format-font-family": FEATURES.fontFamily,
  "quill-format-font-size": FEATURES.fontSize,
  "quill-format-bold": FEATURES.bold,
  "quill-format-italic": FEATURES.italic,
  "quill-format-underline": FEATURES.underline,
  "quill-format-ordered-list": FEATURES.orderedList,
  "quill-format-unordered-list": FEATURES.unorderedList,
  "quill-format-align-left": FEATURES.align,
  "quill-format-align-center": FEATURES.align,
  "quill-format-align-right": FEATURES.align,
  "quill-format-align-justify": FEATURES.align,
  "quill-format-highlight": FEATURES.backgroundColor,
  "quill-format-link": FEATURES.link,
  "quill-format-link-target": FEATURES.linkTarget,
  "quill-format-text-color": FEATURES.color,
  "quill-format-text-color-palette": FEATURES.color,
};

export class FormatToolbar extends LitElement {
  static properties = {
    title: { type: String },
  };

  constructor() {
    super();
    this.title = "Text";
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div id="text" class="tools">
        <h2>${this.title}</h2>
        <element-type-selector></element-type-selector>
        <format-font-family></format-font-family>
        <format-text-color-palette></format-text-color-palette>
        <div class="format-group">
          <format-bold></format-bold>
          <format-italic></format-italic>
          <format-underline></format-underline>
          <format-font-size></format-font-size>
        </div>
        <div class="format-group-aligns">
          <format-align-left applied></format-align-left>
          <format-align-center></format-align-center>
          <format-align-right></format-align-right>
          <format-align-justify></format-align-justify>
        </div>
        <div class="format-group">
          <format-ordered-list></format-ordered-list>
          <format-unordered-list></format-unordered-list>
          <format-link></format-link>
          <format-link-target></format-link-target>
        </div>
        <div class="format-group">
          <format-highlight></format-highlight>
          <format-icon-background-color></format-icon-background-color>
        </div>
      </div>

      <div id="quill-text" hidden class="tools">
        <h2>Quill Text</h2>
        <quill-element-type-selector></quill-element-type-selector>
        <quill-format-font-family></quill-format-font-family>
        <quill-format-text-color-palette></quill-format-text-color-palette>
        <div class="format-group">
          <quill-format-bold></quill-format-bold>
          <quill-format-italic></quill-format-italic>
          <quill-format-underline></quill-format-underline>
          <quill-format-font-size></quill-format-font-size>
        </div>
        <div class="format-group-aligns">
          <quill-format-align-left applied></quill-format-align-left>
          <quill-format-align-center></quill-format-align-center>
          <quill-format-align-right></quill-format-align-right>
          <quill-format-align-justify></quill-format-align-justify>
        </div>
        <div class="format-group">
          <quill-format-ordered-list></quill-format-ordered-list>
          <quill-format-unordered-list></quill-format-unordered-list>
          <quill-format-link></quill-format-link>
          <quill-format-link-target></quill-format-link-target>
        </div>
        <div class="format-group">
          <quill-format-highlight></quill-format-highlight>
          <quill-format-text-color></quill-format-text-color>
        </div>
      </div>

      <div id="button" hidden class="tools">
        <h2>Button</h2>
        <format-button-design></format-button-design>
        <format-button-icon-placement></format-button-icon-placement>
        <div class="format-link-group">
          <format-button-link></format-button-link>
          <format-disabled></format-disabled>
          <format-button-link-target></format-button-link-target>
        </div>
      </div>

      <div id="image" hidden class="tools">
        <h2>Image</h2>
        <div class="format-link-group">
          <format-image-link></format-image-link>
          <format-disabled></format-disabled>
          <format-image-link-target></format-image-link-target>
        </div>
        <image-background-color></image-background-color>
        <format-image-object-fit></format-image-object-fit>
        <div class="group-label">Border</div>
        <div class="format-border-group">
          <image-border-style></image-border-style>
          <image-border-color></image-border-color>
          <image-border-width></image-border-width>
        </div>
        <image-border-position></image-border-position>
        <image-border-radius></image-border-radius>
      </div>

      <div id="table" hidden class="tools">
        <h2>Table</h2>
        <format-table-headers></format-table-headers>
        <table-header-background-color></table-header-background-color>
        <table-body-background-color></table-body-background-color>
        <div class="group-label">Border</div>
        <div class="format-border-group">
          <table-border-style></table-border-style>
          <table-border-color></table-border-color>
          <table-border-width></table-border-width>
        </div>
        <table-border-position></table-border-position>
      </div>
    `;
  }

  firstUpdated() {
    for (const selector of [...FORMATTERS, ...QUILL_FORMATTERS]) {
      this.#setDisabled(selector, true);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("selection-format-change", this.#selectionFormatChange);
  }

  disconnectedCallback() {
    this.removeEventListener("selection-format-change", this.#selectionFormatChange);
    super.disconnectedCallback();
  }

  #selectionFormatChange = (event) => {
    const format = event.detail;
    const imageSelected = format?.type === "image";
    const buttonSelected = format?.type === "button";
    const iconSelected = format?.type === "icon";
    const tableSelected = format?.type === "table";
    const quillSelected = format?.editor === "quill";
    const nonTextSelected = imageSelected || buttonSelected || iconSelected || tableSelected;
    const backgroundColorSelected = iconSelected || format?.highlight;

    this.querySelector("#text")?.toggleAttribute(
      "hidden",
      quillSelected || buttonSelected || imageSelected || tableSelected,
    );
    this.querySelector("#quill-text")?.toggleAttribute("hidden", !quillSelected);
    this.querySelector("#button")?.toggleAttribute("hidden", !buttonSelected);
    this.querySelector("#image")?.toggleAttribute("hidden", !imageSelected);
    this.querySelector("#table")?.toggleAttribute("hidden", !tableSelected);

    this.#setValue("element-type-selector", nonTextSelected ? "p" : (format?.type ?? "p"));
    this.#setValue(
      "format-font-family",
      format?.fontFamily || (format?.type === "p" ? "var(--font-body)" : "var(--font-heading)"),
    );
    this.#setValue("format-font-size", format?.fontSize ?? "");
    this.#setApplied("format-bold", format?.bold ?? false);
    this.#setApplied("format-italic", format?.italic ?? false);
    this.#setApplied("format-underline", format?.underline ?? false);
    this.#setApplied("format-ordered-list", format?.orderedList ?? false);
    this.#setApplied("format-unordered-list", format?.unorderedList ?? false);
    this.#setApplied("format-align-left", !format?.align || format.align === "left");
    this.#setApplied("format-align-center", format?.align === "center");
    this.#setApplied("format-align-right", format?.align === "right");
    this.#setApplied("format-align-justify", format?.align === "justify");
    this.#setApplied("format-highlight", format?.highlight ?? false);
    this.#setApplied("format-link", Boolean(format?.link));
    this.#setValue("format-link", format?.link ?? "");
    this.#setValue("format-link-target", format?.target ?? "_self");
    this.#setApplied("format-button-link", buttonSelected && Boolean(format?.link));
    this.#setValue("format-button-link", buttonSelected ? (format?.link ?? "") : "");
    this.#setValue(
      "format-button-link-target",
      buttonSelected ? (format?.target ?? "_self") : "_self",
    );
    this.#setApplied("format-image-link", imageSelected && Boolean(format?.link));
    this.#setValue("format-image-link", imageSelected ? (format?.link ?? "") : "");
    this.#setValue("format-image-link-target", format?.target ?? "_self");
    this.#setValue("format-text-color", toHex(format?.color, "#000000"));
    this.#setValue("format-text-color-palette", toHex(format?.color, "#000000"));
    this.#setValue("format-icon-background-color", toHex(format?.backgroundColor, "#ffffff"));
    this.#setValue("image-background-color", format?.backgroundColor ?? "");
    this.#setValue("image-border-width", format?.borderWidth ?? "");
    this.#setValue("image-border-color", format?.borderColor ?? "");
    this.#setValue("image-border-style", format?.borderStyle ?? "");
    this.#setValue("image-border-position", format?.borderPosition ?? "");
    this.#setValue("image-border-radius", format?.borderRadius ?? "");
    this.#setValue("format-image-object-fit", format?.objectFit ?? "none");
    this.#setValue("format-button-design", format?.buttonDesign ?? "primary");
    this.#setValue("format-button-icon-placement", format?.buttonIconPlacement ?? "none");
    this.#setApplied("format-disabled", Boolean(format?.disabled));
    this.#setProperty("format-table-headers", "headerRow", Boolean(format?.headerRow));
    this.#setProperty("format-table-headers", "headerColumn", Boolean(format?.headerColumn));
    this.#setValue("table-header-background-color", format?.headerBackgroundColor ?? "");
    this.#setValue("table-body-background-color", format?.bodyBackgroundColor ?? "");
    this.#setValue("table-border-width", format?.borderWidth ?? "");
    this.#setValue("table-border-color", format?.borderColor ?? "");
    this.#setValue("table-border-style", format?.borderStyle ?? "");
    this.#setValue("table-border-position", format?.borderPosition ?? "");
    this.#setQuillFormatterState(format);

    for (const selector of FORMATTERS) this.#setDisabled(selector, !format);
    for (const selector of QUILL_FORMATTERS) {
      this.#setDisabled(selector, !format || !quillSelected);
    }

    for (const selector of TEXT_FORMATTERS) {
      this.#setDisabled(selector, !format || nonTextSelected);
    }

    for (const [selector, property] of INLINE_FORMATTERS) {
      const appliesToBlock =
        (selector === "format-bold" || selector === "format-font-size") && format?.type !== "p";
      this.#setDisabled(
        selector,
        !format ||
          nonTextSelected ||
          (format.collapsed !== false && !format[property] && !appliesToBlock),
      );
    }

    this.#setDisabled(
      "format-text-color-palette",
      !format || nonTextSelected || format.collapsed !== false,
    );
    this.#setDisabled("quill-format-link-target", !quillSelected || !format?.link);
    this.#setDisabled("format-icon-background-color", !backgroundColorSelected);
    this.#setDisabled("format-link-target", nonTextSelected || !format?.link);
    this.#setDisabled("image-background-color", !imageSelected);
    this.#setDisabled("image-border-width", !imageSelected);
    this.#setDisabled("image-border-color", !imageSelected);
    this.#setDisabled("image-border-style", !imageSelected);
    this.#setDisabled("image-border-position", !imageSelected || !hasBorder(format));
    this.#setDisabled("image-border-radius", !imageSelected);
    this.#setDisabled("format-image-object-fit", !imageSelected);
    this.#setDisabled("format-button-design", !buttonSelected);
    this.#setDisabled("format-button-icon-placement", !buttonSelected);
    this.#setDisabled("format-button-link", !buttonSelected);
    this.#setDisabled("format-button-link-target", !buttonSelected || !format?.link);
    this.#setDisabled("format-image-link", !imageSelected);
    this.#setDisabled("format-image-link-target", !imageSelected || !format?.link);
    this.#setDisabled("format-disabled", !buttonSelected && !imageSelected);
    this.#setDisabled("format-table-headers", !tableSelected);
    this.#setDisabled("table-header-background-color", !tableSelected);
    this.#setDisabled("table-body-background-color", !tableSelected);
    this.#setDisabled("table-border-width", !tableSelected);
    this.#setDisabled("table-border-color", !tableSelected);
    this.#setDisabled("table-border-style", !tableSelected);
    this.#setDisabled("table-border-position", !tableSelected || !hasBorder(format));

    if (iconSelected) {
      for (const selector of FORMATTERS) this.#setDisabled(selector, true);
      for (const selector of [
        "format-font-size",
        "format-link",
        "format-text-color",
        "format-text-color-palette",
        "format-icon-background-color",
      ]) {
        this.#setDisabled(selector, false);
      }
    }

    this.#applyCapabilities(format);
  };

  #setQuillFormatterState(format) {
    this.#setValue("quill-element-type-selector", format?.type ?? "p");
    this.#setValue(
      "quill-format-font-family",
      format?.fontFamily || (format?.type === "p" ? "var(--font-body)" : "var(--font-heading)"),
    );
    this.#setValue("quill-format-font-size", format?.fontSize ?? "");
    this.#setApplied("quill-format-bold", format?.bold ?? false);
    this.#setApplied("quill-format-italic", format?.italic ?? false);
    this.#setApplied("quill-format-underline", format?.underline ?? false);
    this.#setApplied("quill-format-ordered-list", format?.orderedList ?? false);
    this.#setApplied("quill-format-unordered-list", format?.unorderedList ?? false);
    this.#setApplied("quill-format-align-left", !format?.align || format.align === "left");
    this.#setApplied("quill-format-align-center", format?.align === "center");
    this.#setApplied("quill-format-align-right", format?.align === "right");
    this.#setApplied("quill-format-align-justify", format?.align === "justify");
    this.#setApplied("quill-format-highlight", format?.highlight ?? false);
    this.#setApplied("quill-format-link", Boolean(format?.link));
    this.#setValue("quill-format-link", format?.link ?? "");
    this.#setValue("quill-format-link-target", format?.target ?? "_self");
    this.#setValue("quill-format-text-color", toHex(format?.color, "#000000"));
    this.#setValue("quill-format-text-color-palette", toHex(format?.color, "#000000"));
  }

  #setApplied(selector, applied) {
    for (const formatter of this.querySelectorAll(selector)) formatter.applied = applied;
  }

  #setValue(selector, value) {
    for (const formatter of this.querySelectorAll(selector)) formatter.value = value;
  }

  #setProperty(selector, property, value) {
    for (const formatter of this.querySelectorAll(selector)) formatter[property] = value;
  }

  #setDisabled(selector, disabled) {
    for (const formatter of this.querySelectorAll(selector)) formatter.disabled = disabled;
  }

  #setHidden(selector, hidden) {
    for (const formatter of this.querySelectorAll(selector)) formatter.hidden = hidden;
  }

  #applyCapabilities(format) {
    for (const [selector, feature] of Object.entries(FORMATTER_FEATURES)) {
      const disabled = Boolean(format) && !isFeatureEnabled(format, feature);
      this.#setHidden(selector, false);
      if (disabled) this.#setDisabled(selector, true);
    }
  }
}

function toHex(color, fallback) {
  if (/^#[\da-f]{6}$/i.test(color)) return color.toLowerCase();

  const values = color?.match(/\d+/g);
  if (!values || values.length < 3) return fallback;

  return `#${values
    .slice(0, 3)
    .map((value) => Number(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function hasBorder(format) {
  if (!format) return false;
  return Boolean(format.borderWidth) && format.borderStyle !== "";
}

customElements.define("format-toolbar", FormatToolbar);
