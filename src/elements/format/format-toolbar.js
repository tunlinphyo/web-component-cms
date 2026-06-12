import { LitElement, html } from "lit";

const FORMATTERS = [
  "element-type-selector",
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
];

const TEXT_FORMATTERS = [
  "element-type-selector",
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

    this.#setValue("element-type-selector", imageSelected ? "p" : (format?.type ?? "p"));
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
    this.#setValue("format-text-color", toHex(format?.color, "#000000"));
    this.#setValue("format-text-color-palette", toHex(format?.color, "#000000"));

    for (const selector of FORMATTERS) this.#setDisabled(selector, !format);

    for (const selector of TEXT_FORMATTERS) {
      this.#setDisabled(selector, !format || imageSelected);
    }

    for (const [selector, property] of INLINE_FORMATTERS) {
      const appliesToBlock = selector === "format-bold" && format?.type !== "p";
      this.#setDisabled(
        selector,
        !format ||
          imageSelected ||
          (format.collapsed !== false && !format[property] && !appliesToBlock),
      );
    }

    this.#setDisabled(
      "format-text-color-palette",
      !format || imageSelected || format.collapsed !== false,
    );
  };

  #setApplied(selector, applied) {
    const formatter = this.querySelector(selector);
    if (formatter) formatter.applied = applied;
  }

  #setValue(selector, value) {
    const formatter = this.querySelector(selector);
    if (formatter) formatter.value = value;
  }

  #setDisabled(selector, disabled) {
    const formatter = this.querySelector(selector);
    if (formatter) formatter.disabled = disabled;
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
