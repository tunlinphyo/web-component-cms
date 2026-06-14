import { LitElement } from "lit";
import { html, unsafeStatic } from "lit/static-html.js";
import {
  insertPlainText,
  isSelectionInside,
  normalizeBlockType,
  normalizeParagraphs,
  removeLinkSelectionPreview,
  selectRange,
  serializeHtml,
} from "./utils.js";
import { richTextBlockStyles } from "./rich-text-block.styles.js";
import {
  captureEditorState,
  getEditorElement,
  getEditorSelection,
  initializeEditor,
  normalizeEditorInput,
  normalizeEditorParagraphs,
  placeCaretInEmptyEditor,
  restoreEditorState,
  setDefaultParagraphSeparator,
  syncEditorFromProperties,
  updateEditorPlaceholder,
} from "./rich-text-editor-dom.js";
import { applySelectionCommand, describeSelectionFormat } from "./rich-text-formatting.js";

export class RichTextBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    value: { type: String, reflect: true },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    textAlign: { type: String, attribute: "text-align", reflect: true },
    fontWeight: { type: String, attribute: "font-weight", reflect: true },
  };

  constructor() {
    super();
    this.blockId = "";
    this.value = "";
    this.placeholder = "";
    this.disabled = false;
    this.type = "p";
    this.textAlign = "left";
    this.fontWeight = "";
    this.selectedRange = null;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("mouseup", this.#mouseup);
    document.addEventListener("selectionchange", this.#selectionchange);
  }

  disconnectedCallback() {
    document.removeEventListener("mouseup", this.#mouseup);
    document.removeEventListener("selectionchange", this.#selectionchange);
    super.disconnectedCallback();
  }

  init({ id = "", value = "", textAlign = "left", fontWeight = "", type = "p" } = {}) {
    this.blockId = id;
    this.type = normalizeBlockType(type);
    this.value = normalizeParagraphs(value, this.type);
    this.textAlign = textAlign;
    this.fontWeight = fontWeight;

    void this.updateComplete.then(() => {
      const editor = getEditorElement(this.renderRoot);
      if (!editor) return;

      initializeEditor(editor, this);
    });

    return this;
  }

  setType(type) {
    const nextType = normalizeBlockType(type);
    const editor = getEditorElement(this.renderRoot);

    if (!editor || nextType === this.type) return false;

    const editorState = captureEditorState(editor);
    this.type = nextType;

    void this.updateComplete.then(() => {
      const nextEditor = getEditorElement(this.renderRoot);
      if (!nextEditor) return;

      restoreEditorState(nextEditor, { ...editorState, type: this.type });
      this.#notifySelection();
    });

    return true;
  }

  toJSON() {
    const editor = getEditorElement(this.renderRoot);
    const value = editor && serializeHtml(editor.innerHTML);
    const data = {
      textAlign: editor?.style.textAlign || this.textAlign || "left",
      fontWeight: editor?.style.fontWeight || this.fontWeight || "",
      type: this.type,
    };

    return { id: this.blockId, value: value ?? serializeHtml(this.value, false), ...data };
  }

  static styles = richTextBlockStyles;

  render() {
    const tag = unsafeStatic(this.type === "p" ? "div" : normalizeBlockType(this.type));

    return html`
      <${tag}
        class="editor"
        part="editor"
        contenteditable=${this.disabled ? "false" : "true"}
        data-placeholder=${this.placeholder}
        @focus=${this.#onFocus}
        @keydown=${this.#onKeyDown}
        @paste=${this.#paste}
        @input=${this.#onInput}
      ></${tag}>
    `;
  }

  firstUpdated() {
    this.#syncEditor();
  }

  #onFocus = (event) => {
    setDefaultParagraphSeparator();
    placeCaretInEmptyEditor(event.currentTarget, getEditorSelection(this.renderRoot));
  };

  #onKeyDown = (event) => {
    if (event.key !== "Enter" || this.type !== "p" || event.shiftKey) return;
    event.preventDefault();
    document.execCommand("insertParagraph");
    void this.updateComplete.then(() => {
      const editor = getEditorElement(this.renderRoot);
      if (!editor) return;

      normalizeEditorParagraphs(editor, this.type);
      this.#notifySelection();
    });
  };

  #onInput = () => {
    if (this.type !== "p") return;
    const editor = getEditorElement(this.renderRoot);
    if (!editor) return;

    normalizeEditorInput(editor, this.type);
    this.#notifySelection();
  };

  updated(changedProperties) {
    if (
      changedProperties.has("value") ||
      changedProperties.has("textAlign") ||
      changedProperties.has("fontWeight")
    ) {
      this.#syncEditor();
    }
    if (changedProperties.has("placeholder")) {
      const editor = getEditorElement(this.renderRoot);
      if (editor) updateEditorPlaceholder(editor, this.placeholder);
    }
  }

  #syncEditor() {
    const editor = getEditorElement(this.renderRoot);

    if (!editor || this.renderRoot.activeElement === editor) return;

    syncEditorFromProperties(editor, this);
  }

  captureSelection() {
    const selection = getEditorSelection(this.renderRoot);
    const editor = getEditorElement(this.renderRoot);

    if (!isSelectionInside(editor, selection)) {
      this.selectedRange = null;
      this.toggleAttribute("has-format-selection", false);
      return false;
    }

    this.selectedRange = selection.getRangeAt(0).cloneRange();
    this.toggleAttribute("has-format-selection", !selection.isCollapsed);
    return true;
  }

  clearSelection() {
    this.#removeLinkSelectionPreview();
    this.selectedRange = null;
    this.removeAttribute("has-format-selection");
  }

  restoreSelection() {
    const selection = getEditorSelection(this.renderRoot);
    const editor = getEditorElement(this.renderRoot);

    if (
      !selection ||
      !this.selectedRange ||
      !editor?.contains(this.selectedRange.commonAncestorContainer)
    ) {
      return false;
    }

    selectRange(selection, this.selectedRange);
    return true;
  }

  formatSelection(command, value = null) {
    if (command === "linkCancel") {
      this.#removeLinkSelectionPreview();
      return true;
    }

    if (!this.selectedRange) return false;

    const selection = getEditorSelection(this.renderRoot);
    const editor = getEditorElement(this.renderRoot);
    if (!selection || !editor) return false;

    const result = applySelectionCommand({
      command,
      value,
      editor,
      type: this.type,
      range: this.selectedRange,
      selection,
      onFontWeightChange: (fontWeight) => {
        this.fontWeight = fontWeight;
      },
    });
    this.selectedRange = result.range;
    if (!result.shouldNotify) return true;

    this.#notifySelection();
    return true;
  }

  #removeLinkSelectionPreview() {
    const editor = getEditorElement(this.renderRoot);
    removeLinkSelectionPreview(editor, this.selectedRange);
  }

  align(alignment) {
    const editor = getEditorElement(this.renderRoot);
    if (!editor) return false;

    editor.style.textAlign = alignment;
    this.#notifySelection();
    return true;
  }

  getSelectionFormat() {
    return describeSelectionFormat({
      editor: getEditorElement(this.renderRoot),
      type: this.type,
      textAlign: this.textAlign,
      range: this.selectedRange,
      selection: getEditorSelection(this.renderRoot),
    });
  }

  #notifySelection() {
    this.captureSelection();
    this.#dispatchSelection();
  }

  #dispatchSelection() {
    this.dispatchEvent(
      new CustomEvent("selection-format-change", {
        detail: this.getSelectionFormat(),
        bubbles: true,
        composed: true,
      }),
    );
  }

  #mouseup = (event) => {
    if (!event.composedPath().includes(this)) return;

    queueMicrotask(() => {
      this.#removeLinkSelectionPreview();
      if (this.captureSelection()) this.#dispatchSelection();
    });
  };

  #selectionchange = () => {
    const selection = getEditorSelection(this.renderRoot);
    const editor = getEditorElement(this.renderRoot);

    if (!isSelectionInside(editor, selection)) return;

    if (this.captureSelection()) this.#dispatchSelection();
  };

  #paste = (event) => {
    event.preventDefault();

    const selection = getEditorSelection(this.renderRoot);
    const text = event.clipboardData?.getData("text/plain") ?? "";
    if (!insertPlainText(selection, text)) return;
    this.#notifySelection();
  };
}

customElements.define("rich-text-block", RichTextBlock);
