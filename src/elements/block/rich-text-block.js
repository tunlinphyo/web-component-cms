import { LitElement, css } from "lit";
import { html, unsafeStatic } from "lit/static-html.js";

const BLOCK_TYPES = ["h1", "h2", "h3", "p"];

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

  init({ id = "", value = "", textAlign = "left", fontWeight = "", type = "p" } = {}) {
    this.blockId = id;
    this.type = this.#normalizeType(type);
    this.value = this.#normalizeParagraphs(value);
    this.textAlign = textAlign;
    this.fontWeight = fontWeight;

    void this.updateComplete.then(() => {
      const editor = this.renderRoot.querySelector(".editor");
      if (!editor) return;

      editor.innerHTML = this.value;
      editor.style.textAlign = this.textAlign;
      editor.style.fontWeight = this.fontWeight;
    });

    return this;
  }

  setType(type) {
    const nextType = this.#normalizeType(type);
    const editor = this.renderRoot.querySelector(".editor");

    if (!editor || nextType === this.type) return false;

    const value = editor.innerHTML;
    const textAlign = editor.style.textAlign;
    const fontWeight = editor.style.fontWeight;
    this.type = nextType;

    void this.updateComplete.then(() => {
      const nextEditor = this.renderRoot.querySelector(".editor");
      if (!nextEditor) return;

      nextEditor.innerHTML = this.#normalizeParagraphs(value);
      nextEditor.style.textAlign = textAlign;
      nextEditor.style.fontWeight = fontWeight;
      this.#notifySelection();
    });

    return true;
  }

  toJSON() {
    const editor = this.renderRoot.querySelector(".editor");
    const value = editor?.innerHTML.replace(/\r?\n/g, "<br>").replace(/(?:<br>)+$/, "");
    const data = {
      textAlign: editor?.style.textAlign || this.textAlign || "left",
      fontWeight: editor?.style.fontWeight || this.fontWeight || "",
      type: this.type,
    };

    return { id: this.blockId, value: value ?? this.value.replace(/\r?\n/g, "<br>"), ...data };
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor {
      box-sizing: border-box;
      outline: none;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }

    :host(:not([disabled])) .editor:focus,
    :host(:not([disabled])[active]) .editor,
    :host(:not([disabled])[has-format-selection]) .editor {
      outline: 2px solid var(--highlight);
      outline-offset: 2px;
    }

    .editor:empty::before {
      content: attr(data-placeholder);
      color: #888;
      pointer-events: none;
    }

    mark {
      background-color: var(--yellow);
    }

    [data-link-selection] {
      /* background-color: Highlight;
      color: HighlightText; */
      text-decoration: underline;
    }

    :host([disabled]) .editor {
      opacity: 0.6;
      cursor: not-allowed;
      user-select: none;
    }

    p {
      margin-block: 0.25rem;
    }
  `;

  render() {
    const tag = unsafeStatic(this.type === "p" ? "div" : this.#normalizeType(this.type));

    return html`
      <${tag}
        class="editor"
        part="editor"
        contenteditable=${this.disabled ? "false" : "true"}
        data-placeholder=${this.placeholder}
        @focus=${() => document.execCommand("defaultParagraphSeparator", false, "p")}
        @paste=${this.#paste}
        @mouseup=${() => this.#notifySelection()}
        @keyup=${() => this.#notifySelection()}
      ></${tag}>
    `;
  }

  firstUpdated() {
    this.#syncEditor();
  }

  updated(changedProperties) {
    if (
      changedProperties.has("value") ||
      changedProperties.has("textAlign") ||
      changedProperties.has("fontWeight")
    ) {
      this.#syncEditor();
    }
  }

  #syncEditor() {
    const editor = this.renderRoot.querySelector(".editor");

    if (!editor || this.renderRoot.activeElement === editor) return;

    const value = this.#normalizeParagraphs(this.value);
    if (editor.innerHTML !== value) editor.innerHTML = value;
    editor.style.textAlign = this.textAlign;
    editor.style.fontWeight = this.fontWeight;
  }

  captureSelection() {
    const selection = this.#getSelection();
    const editor = this.renderRoot.querySelector(".editor");

    if (
      !selection ||
      selection.rangeCount === 0 ||
      !editor.contains(selection.anchorNode) ||
      !editor.contains(selection.focusNode)
    ) {
      this.selectedRange = null;
      this.toggleAttribute("has-format-selection", false);
      return false;
    }

    this.selectedRange = selection.getRangeAt(0).cloneRange();
    this.toggleAttribute("has-format-selection", !selection.isCollapsed);
    return true;
  }

  clearSelection() {
    this.selectedRange = null;
    this.removeAttribute("has-format-selection");
  }

  formatSelection(command, value = null) {
    if (command === "linkCancel") {
      this.#removeLinkSelectionPreview();
      return true;
    }

    if (!this.selectedRange) return false;

    const selection = this.#getSelection();
    if (!selection) return false;

    selection.removeAllRanges();
    selection.addRange(this.selectedRange);
    if (command === "bold" && this.type !== "p") {
      const editor = this.renderRoot.querySelector(".editor");
      this.fontWeight = editor.style.fontWeight === "normal" ? "" : "normal";
      editor.style.fontWeight = this.fontWeight;
    } else if (command === "bold" || command === "italic" || command === "underline") {
      const selector = command === "bold" ? "strong, b" : command === "italic" ? "em, i" : "u";
      const formatElement = this.selectedRange.collapsed && this.#getSelectedAncestor(selector);

      if (formatElement) {
        const marker = document.createComment("caret");
        this.selectedRange.insertNode(marker);
        formatElement.replaceWith(...formatElement.childNodes);
        this.selectedRange.setStartBefore(marker);
        this.selectedRange.collapse(true);
        marker.remove();
        selection.removeAllRanges();
        selection.addRange(this.selectedRange);
      } else {
        document.execCommand(command, false, value);
      }
    } else if (command === "linkEdit") {
      if (this.selectedRange.collapsed) return true;

      const link = this.#getSelectedAncestor("a");

      if (link) {
        link.toggleAttribute("data-link-selection", true);
        this.selectedRange.selectNodeContents(link);
      } else if (!this.#getSelectedAncestor("[data-link-selection]")) {
        const preview = document.createElement("span");
        preview.toggleAttribute("data-link-selection", true);
        preview.append(this.selectedRange.extractContents());
        this.selectedRange.insertNode(preview);
        this.selectedRange.selectNodeContents(preview);
      }

      selection.removeAllRanges();
      selection.addRange(this.selectedRange);
    } else if (command === "highlight" || command === "link") {
      const selector = command === "highlight" ? "mark" : "a";
      const tagName = command === "highlight" ? "mark" : "a";
      const formatElement = this.#getSelectedAncestor(selector);
      const preview = command === "link" ? this.#getSelectedAncestor("[data-link-selection]") : null;

      if (command === "link" && value && formatElement) {
        formatElement.setAttribute("href", value);
        formatElement.removeAttribute("data-link-selection");
        this.selectedRange.selectNodeContents(formatElement);
      } else if (command === "link" && value && preview) {
        const link = document.createElement("a");
        link.setAttribute("href", value);
        link.append(...preview.childNodes);
        preview.replaceWith(link);
        this.selectedRange.selectNodeContents(link);
      } else if (formatElement) {
        const firstChild = formatElement.firstChild;
        const lastChild = formatElement.lastChild;
        formatElement.replaceWith(...formatElement.childNodes);
        this.selectedRange.setStartBefore(firstChild);
        this.selectedRange.setEndAfter(lastChild);
      } else if (command === "highlight" || value) {
        const element = document.createElement(tagName);
        if (command === "link") element.setAttribute("href", value);
        element.append(this.selectedRange.extractContents());
        this.selectedRange.insertNode(element);
        this.selectedRange.selectNodeContents(element);
      }

      selection.removeAllRanges();
      selection.addRange(this.selectedRange);
    } else {
      document.execCommand(command, false, value);
      if (command === "insertOrderedList" || command === "insertUnorderedList") {
        this.#unwrapListsFromParagraphs();
        this.#wrapParagraphContent();
      }
    }
    this.selectedRange = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    this.#notifySelection();
    return true;
  }

  #unwrapListsFromParagraphs() {
    const editor = this.renderRoot.querySelector(".editor");

    for (const list of editor.querySelectorAll("p > ul, p > ol")) {
      const paragraph = list.parentElement;
      const before = document.createElement("p");
      const after = document.createElement("p");

      while (paragraph.firstChild !== list) before.append(paragraph.firstChild);
      while (list.nextSibling) after.append(list.nextSibling);

      paragraph.replaceWith(
        ...(before.hasChildNodes() ? [before] : []),
        list,
        ...(after.hasChildNodes() ? [after] : []),
      );
    }
  }

  #wrapParagraphContent() {
    if (this.type !== "p") return;

    const editor = this.renderRoot.querySelector(".editor");
    const fragment = document.createDocumentFragment();
    let paragraph = null;

    for (const node of [...editor.childNodes]) {
      if (node.nodeType === Node.ELEMENT_NODE && ["P", "UL", "OL"].includes(node.tagName)) {
        paragraph = null;
        fragment.append(node);
      } else if (node.nodeName === "BR") {
        paragraph = null;
        node.remove();
      } else {
        paragraph ??= fragment.appendChild(document.createElement("p"));
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV") {
          paragraph.append(...node.childNodes);
          node.remove();
        } else {
          paragraph.append(node);
        }
      }
    }

    editor.append(fragment);
  }

  #removeLinkSelectionPreview() {
    const editor = this.renderRoot.querySelector(".editor");
    const preview =
      this.selectedRange && this.#getSelectedAncestor("[data-link-selection]") ||
      editor?.querySelector("[data-link-selection]");
    if (!preview) return;

    preview.removeAttribute("data-link-selection");
    if (preview.localName === "a") return;

    const firstChild = preview.firstChild;
    const lastChild = preview.lastChild;
    preview.replaceWith(...preview.childNodes);
    if (this.selectedRange) {
      this.selectedRange.setStartBefore(firstChild);
      this.selectedRange.setEndAfter(lastChild);
    }
  }

  align(alignment) {
    const editor = this.renderRoot.querySelector(".editor");
    if (!editor) return false;

    editor.style.textAlign = alignment;
    this.#notifySelection();
    return true;
  }

  getSelectionFormat() {
    const editor = this.renderRoot.querySelector(".editor");
    const align = editor?.style.textAlign || this.textAlign || "left";

    if (!this.selectedRange) return { align, type: this.type };

    const selection = this.#getSelection();
    if (!selection) return { align, type: this.type };

    selection.removeAllRanges();
    selection.addRange(this.selectedRange);

    return {
      bold: editor?.style.fontWeight !== "normal" && document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      orderedList: document.queryCommandState("insertOrderedList"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      align,
      type: this.type,
      collapsed: this.selectedRange.collapsed,
      highlight: Boolean(this.#getSelectedAncestor("mark")),
      link: this.#getSelectedAncestor("a")?.getAttribute("href") ?? "",
      color: document.queryCommandValue("foreColor"),
      colorApplied: Boolean(this.#getSelectedAncestor("font[color], [style*='color']")),
    };
  }

  #getSelectedAncestor(selector) {
    const editor = this.renderRoot.querySelector(".editor");
    let element = this.selectedRange.startContainer;

    if (element.nodeType !== Node.ELEMENT_NODE) element = element.parentElement;

    while (element && element !== editor) {
      if (element.matches(selector)) return element;
      element = element.parentElement;
    }

    return null;
  }

  #notifySelection() {
    this.captureSelection();
    this.dispatchEvent(
      new CustomEvent("selection-format-change", {
        detail: this.getSelectionFormat(),
        bubbles: true,
        composed: true,
      }),
    );
  }

  #paste = (event) => {
    event.preventDefault();

    const selection = this.#getSelection();
    const text = event.clipboardData?.getData("text/plain") ?? "";
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const node = document.createTextNode(text);
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    this.#notifySelection();
  };

  #getSelection() {
    return this.renderRoot.getSelection?.() ?? document.getSelection();
  }

  #normalizeType(type) {
    return BLOCK_TYPES.includes(type) ? type : "p";
  }

  #normalizeParagraphs(value) {
    if (this.type !== "p" || !value) return value;

    const template = document.createElement("template");
    const output = document.createElement("div");
    let paragraph = null;
    template.innerHTML = value;

    for (const node of [...template.content.childNodes]) {
      if (node.nodeType === Node.ELEMENT_NODE && ["P", "UL", "OL"].includes(node.tagName)) {
        paragraph = null;
        output.append(node);
      } else if (node.nodeName === "BR") {
        paragraph = null;
      } else {
        paragraph ??= output.appendChild(document.createElement("p"));
        paragraph.append(node);
      }
    }

    return output.innerHTML;
  }
}

customElements.define("rich-text-block", RichTextBlock);
