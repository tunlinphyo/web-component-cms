import { LitElement, html } from "lit";

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
  "format-text-color",
  "format-text-color-palette",
  "format-icon-background-color",
  "image-background-color",
  "image-border-width",
  "image-border-color",
  "image-border-style",
  "image-border-radius",
  "format-image-link",
  "format-image-link-target",
  "format-disabled",
  "format-button-design",
  "format-button-icon-placement",
  "format-button-link",
  "format-button-link-target",
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

export class FormatToolbar extends LitElement {
  render() {
    return html`<slot></slot>`;
  }

  firstUpdated() {
    for (const selector of FORMATTERS) this.#setDisabled(selector, true);
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
    const nonTextSelected = imageSelected || buttonSelected || iconSelected;
    const backgroundColorSelected = iconSelected || format?.highlight;

    this.querySelector("#text")?.toggleAttribute("hidden", buttonSelected || imageSelected);
    this.querySelector("#button")?.toggleAttribute("hidden", !buttonSelected);
    this.querySelector("#image")?.toggleAttribute("hidden", !imageSelected);

    this.#setValue("element-type-selector", nonTextSelected ? "p" : (format?.type ?? "p"));
    this.#setValue(
      "format-font-family",
      format?.fontFamily || (format?.type === "p" ? "var(--font-zen)" : "var(--font-heading)"),
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
    this.#setApplied("format-button-link", buttonSelected && Boolean(format?.link));
    this.#setValue("format-button-link", buttonSelected ? (format?.link ?? "") : "");
    this.#setValue("format-button-link-target", buttonSelected ? (format?.target ?? "_self") : "_self");
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
    this.#setValue("image-border-radius", format?.borderRadius ?? "");
    this.#setValue("format-button-design", format?.buttonDesign ?? "primary");
    this.#setValue("format-button-icon-placement", format?.buttonIconPlacement ?? "none");
    this.#setApplied("format-disabled", Boolean(format?.disabled));

    for (const selector of FORMATTERS) this.#setDisabled(selector, !format);

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
    this.#setDisabled("format-icon-background-color", !backgroundColorSelected);
    this.#setDisabled("image-background-color", !imageSelected);
    this.#setDisabled("image-border-width", !imageSelected);
    this.#setDisabled("image-border-color", !imageSelected);
    this.#setDisabled("image-border-style", !imageSelected);
    this.#setDisabled("image-border-radius", !imageSelected);
    this.#setDisabled("format-button-design", !buttonSelected);
    this.#setDisabled("format-button-icon-placement", !buttonSelected);
    this.#setDisabled("format-button-link", !buttonSelected);
    this.#setDisabled("format-button-link-target", !buttonSelected || !format?.link);
    this.#setDisabled("format-image-link", !imageSelected);
    this.#setDisabled("format-image-link-target", !imageSelected || !format?.link);
    this.#setDisabled("format-disabled", !buttonSelected && !imageSelected);

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
  };

  #setApplied(selector, applied) {
    for (const formatter of this.querySelectorAll(selector)) formatter.applied = applied;
  }

  #setValue(selector, value) {
    for (const formatter of this.querySelectorAll(selector)) formatter.value = value;
  }

  #setDisabled(selector, disabled) {
    for (const formatter of this.querySelectorAll(selector)) formatter.disabled = disabled;
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

customElements.define("format-toolbar", FormatToolbar);
