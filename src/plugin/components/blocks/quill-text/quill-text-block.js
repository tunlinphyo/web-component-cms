import { LitElement, html } from "lit";
import Quill from "quill";
import {
  FEATURES,
  getCapabilities,
  toFeatureAttribute,
} from "../../../registries/formatter-registry.js";
import {
  convertBlockTypeContent,
  normalizeBlockContent,
  normalizeBlockType,
  serializeHtml,
} from "../rich-text/utils.js";
import { quillTextBlockStyles } from "./quill-text-block.styles.js";

const SizeStyle = Quill.import("attributors/style/size");
const FontStyle = Quill.import("attributors/style/font");
SizeStyle.whitelist = null;
FontStyle.whitelist = null;
Quill.register(SizeStyle, true);
Quill.register(FontStyle, true);

const INLINE_COMMANDS = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  foreColor: "color",
  backgroundColor: "background",
  link: "link",
};

const LIST_COMMANDS = {
  insertOrderedList: "ordered",
  insertUnorderedList: "bullet",
};

export class QuillTextBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    value: { type: String, reflect: true },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    predefinedMargin: { type: String, attribute: "predefined-margin", reflect: true },
    type: { type: String, reflect: true },
    textAlign: { type: String, attribute: "text-align", reflect: true },
    fontWeight: { type: String, attribute: "font-weight", reflect: true },
    fontSize: { type: String, attribute: "font-size", reflect: true },
    fontFamily: { type: String, attribute: "font-family", reflect: true },
    features: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.blockId = "";
    this.value = "";
    this.placeholder = "";
    this.disabled = false;
    this.predefinedMargin = "0.5rem";
    this.type = "p";
    this.textAlign = "left";
    this.fontWeight = "";
    this.fontSize = "";
    this.fontFamily = "";
    this.features = undefined;
    this.selectedRange = null;
    this.quill = null;
    this.#loadedValue = null;
    this.#skipTypeLoad = false;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <style>
        ${quillTextBlockStyles}
      </style>
      <div class="quill-container" part="editor"></div>
    `;
  }

  firstUpdated() {
    const container = this.renderRoot.querySelector(".quill-container");
    if (!container) return;

    this.quill = new Quill(container, {
      modules: {
        toolbar: false,
      },
      placeholder: this.placeholder,
      readOnly: this.disabled,
      theme: null,
    });
    const selectionRoot = this.getRootNode();
    this.quill.selection.hasFocus = () => {
      const activeElement = selectionRoot.activeElement;
      return activeElement === this.quill.root || this.quill.root.contains(activeElement);
    };
    this.quill.selection.getNativeRange = () => {
      const selection = selectionRoot.getSelection?.() ?? document.getSelection();
      if (!selection?.rangeCount) return null;

      const nativeRange = selection.getRangeAt(0);
      return nativeRange ? this.quill.selection.normalizeNative(nativeRange) : null;
    };
    this.quill.on("text-change", this.#onTextChange);
    this.quill.on("selection-change", this.#onSelectionChange);
    this.quill.root.classList.add("editor");
    this.#syncPresentation();
    this.#loadValue();
  }

  disconnectedCallback() {
    this.quill?.off("text-change", this.#onTextChange);
    this.quill?.off("selection-change", this.#onSelectionChange);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has("predefinedMargin")) {
      this.style.setProperty("--predefined-margin", this.predefinedMargin || "0.5rem");
    }
    if (!this.quill) return;

    if (changedProperties.has("value") || (changedProperties.has("type") && !this.#skipTypeLoad)) {
      this.#loadValue();
    }
    if (changedProperties.has("type")) this.#skipTypeLoad = false;
    if (changedProperties.has("disabled")) this.quill.enable(!this.disabled);
    if (changedProperties.has("placeholder")) {
      this.quill.root.dataset.placeholder = this.placeholder;
    }
    if (
      changedProperties.has("textAlign") ||
      changedProperties.has("fontWeight") ||
      changedProperties.has("fontSize") ||
      changedProperties.has("fontFamily")
    ) {
      this.#syncPresentation();
    }
  }

  init(options = {}) {
    const {
      id = "",
      value = "",
      textAlign = "left",
      fontWeight = "",
      fontSize = "",
      fontFamily = "",
      type = "p",
    } = options;

    this.blockId = id;
    this.type = normalizeBlockType(type);
    this.value = normalizeBlockContent(value, this.type);
    this.textAlign = textAlign;
    this.fontWeight = fontWeight;
    this.fontSize = this.type === "p" ? "" : fontSize;
    this.fontFamily = fontFamily;
    if (Object.hasOwn(options, "features")) {
      this.features = toFeatureAttribute(options.features);
    }

    return this;
  }

  toJSON() {
    return {
      id: this.blockId,
      value: this.#serializeValue(),
      textAlign: this.textAlign || "left",
      fontWeight: this.fontWeight || "",
      fontSize: this.type === "p" ? "" : this.fontSize || "",
      fontFamily: this.fontFamily || "",
      predefinedMargin: this.predefinedMargin,
      type: this.type,
    };
  }

  setType(type) {
    const nextType = normalizeBlockType(type);
    if (!this.quill || nextType === this.type) return false;

    this.value = convertBlockTypeContent(this.#serializeValue(), this.type, nextType);
    this.type = nextType;
    if (nextType === "p") this.fontSize = "";
    this.#loadedValue = null;
    this.#loadValue();
    this.#notifySelection();
    return true;
  }

  captureSelection({ preserve = false } = {}) {
    const range = this.quill?.getSelection();
    if (!range) {
      if (preserve) return Boolean(this.selectedRange);

      this.selectedRange = null;
      this.removeAttribute("has-format-selection");
      return false;
    }

    this.selectedRange = { index: range.index, length: range.length };
    this.toggleAttribute("has-format-selection", range.length > 0);
    return true;
  }

  clearSelection() {
    this.selectedRange = null;
    this.removeAttribute("has-format-selection");
  }

  restoreSelection() {
    if (!this.quill || !this.selectedRange) return false;

    this.quill.setSelection(this.selectedRange, Quill.sources.SILENT);
    return true;
  }

  formatSelection(command, value = null) {
    if (command === "linkEdit" || command === "linkCancel") return true;
    if (!this.quill || !this.selectedRange) return false;

    const range = this.selectedRange;
    const current = this.quill.getFormat(range);
    const inlineFormat = INLINE_COMMANDS[command];

    if (command === "bold" && this.type !== "p") {
      this.fontWeight = this.fontWeight === "bold" ? "" : "bold";
      this.#syncPresentation();
    } else if (inlineFormat) {
      const nextValue = value ?? !current[inlineFormat];
      this.quill.formatText(range, inlineFormat, nextValue || false, Quill.sources.USER);
    } else if (LIST_COMMANDS[command]) {
      const list = LIST_COMMANDS[command];
      this.quill.formatLine(
        range.index,
        Math.max(range.length, 1),
        "list",
        current.list === list ? false : list,
        Quill.sources.USER,
      );
    } else if (command === "fontSize") {
      if (this.type === "p") {
        this.quill.formatText(range, "size", value || false, Quill.sources.USER);
      } else {
        this.fontSize = value || "";
        this.#syncPresentation();
      }
    } else if (command === "highlight") {
      this.quill.formatText(
        range,
        "background",
        current.background ? false : "#fff59d",
        Quill.sources.USER,
      );
    } else if (command === "linkTarget") {
      this.#setLinkTarget(value);
    } else {
      return false;
    }

    this.restoreSelection();
    this.#notifySelection();
    return true;
  }

  applyQuillFormat(format, value) {
    if (!this.quill || !this.selectedRange) return false;

    this.restoreSelection();
    const range = this.selectedRange;

    if (format === "header") {
      this.quill.formatLine(0, this.quill.getLength(), "header", value, Quill.sources.USER);
      const nextType = value ? `h${value}` : "p";
      if (nextType !== this.type) {
        this.#skipTypeLoad = true;
        this.type = nextType;
      }
      this.#syncPresentation();
    } else if (format === "list" || format === "align") {
      this.quill.formatLine(range, format, value, Quill.sources.USER);
      if (format === "align") this.textAlign = value || "left";
    } else if (format === "linkTarget") {
      this.#setLinkTarget(value);
    } else if (range.length === 0) {
      this.quill.format(format, value, Quill.sources.USER);
    } else {
      this.quill.formatText(range, format, value, Quill.sources.USER);
    }

    this.captureSelection({ preserve: true });
    this.#notifySelection();
    return true;
  }

  align(alignment) {
    if (!this.quill) return false;

    const range = this.selectedRange ?? { index: 0, length: this.quill.getLength() };
    this.quill.formatLine(
      range.index,
      Math.max(range.length, 1),
      "align",
      alignment === "left" ? false : alignment,
      Quill.sources.USER,
    );
    this.textAlign = alignment;
    this.#notifySelection();
    return true;
  }

  setFontFamily(fontFamily) {
    if (!this.quill) return false;

    this.fontFamily = fontFamily;
    this.#syncPresentation();
    this.#notifySelection();
    return true;
  }

  getSelectionFormat() {
    const range = this.selectedRange;
    const format = this.quill && range ? this.quill.getFormat(range) : {};
    const link = this.#getSelectedLink();

    return {
      editor: "quill",
      bold: Boolean(format.bold),
      italic: Boolean(format.italic),
      underline: Boolean(format.underline),
      orderedList: format.list === "ordered",
      unorderedList: format.list === "bullet",
      align: format.align || this.textAlign || "left",
      fontSize: format.size || "",
      fontSizeApplied: Boolean(format.size),
      fontFamily: format.font || this.fontFamily || "",
      type: this.type,
      collapsed: range ? range.length === 0 : true,
      highlight: Boolean(format.background),
      backgroundColor: format.background || "",
      link: format.link || "",
      target: link?.getAttribute("target") || "_self",
      color: format.color || "",
      colorApplied: Boolean(format.color),
      capabilities: getCapabilities("text", this.#effectiveFeatures),
    };
  }

  get #effectiveFeatures() {
    if (this.features != null) return this.features;
    if (this.hasAttribute("features")) return this.getAttribute("features") ?? "";

    return Object.values(FEATURES);
  }

  #loadedValue;
  #skipTypeLoad;

  #loadValue() {
    if (!this.quill) return;

    const normalized = normalizeBlockContent(this.value, this.type);
    const key = `${this.type}:${normalized}`;
    if (key === this.#loadedValue) return;

    this.quill.clipboard.dangerouslyPasteHTML(normalized || "", Quill.sources.SILENT);
    this.#applyBlockType();
    this.#loadedValue = key;
  }

  #applyBlockType() {
    if (!this.quill) return;

    const header = this.type === "p" ? false : Number(this.type.slice(1));
    this.quill.formatLine(0, this.quill.getLength(), "header", header, Quill.sources.SILENT);
  }

  #serializeValue() {
    if (!this.quill) return serializeHtml(this.value, false);

    const htmlValue = this.quill.getSemanticHTML();
    if (this.type === "p") return normalizeBlockContent(htmlValue, "p");

    const template = document.createElement("template");
    template.innerHTML = htmlValue;
    const output = document.createElement("div");
    const nodes = [...template.content.childNodes];

    nodes.forEach((node, index) => {
      if (node.nodeType === Node.ELEMENT_NODE && /^H[1-3]$/.test(node.tagName)) {
        output.append(...node.childNodes);
      } else {
        output.append(node);
      }
      if (index < nodes.length - 1) output.append(document.createElement("br"));
    });

    return serializeHtml(output.innerHTML);
  }

  #syncPresentation() {
    if (!this.quill) return;

    this.quill.root.style.fontFamily = this.fontFamily;
    this.quill.root.style.fontWeight = this.fontWeight;
    this.quill.root.style.fontSize = this.type === "p" ? "" : this.fontSize;
    this.quill.root.style.textAlign = this.textAlign;
  }

  #setLinkTarget(target) {
    const link = this.#getSelectedLink();
    if (!link) return;

    if (target && target !== "_self") link.setAttribute("target", target);
    else link.removeAttribute("target");
  }

  #getSelectedLink() {
    if (!this.quill || !this.selectedRange) return null;

    const [leaf] = this.quill.getLeaf(this.selectedRange.index);
    let element = leaf?.domNode;
    if (element?.nodeType !== Node.ELEMENT_NODE) element = element?.parentElement;
    return element?.closest?.("a") ?? null;
  }

  #notifySelection() {
    this.dispatchEvent(
      new CustomEvent("selection-format-change", {
        bubbles: true,
        composed: true,
        detail: this.getSelectionFormat(),
      }),
    );
  }

  #onTextChange = (_delta, _oldContents, source) => {
    if (source !== Quill.sources.USER) return;

    this.#loadedValue = null;
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    this.#notifySelection();
  };

  #onSelectionChange = (range) => {
    if (!range) return;

    this.selectedRange = { index: range.index, length: range.length };
    this.toggleAttribute("has-format-selection", range.length > 0);
    this.#notifySelection();
  };
}

customElements.define("quill-text-block", QuillTextBlock);
