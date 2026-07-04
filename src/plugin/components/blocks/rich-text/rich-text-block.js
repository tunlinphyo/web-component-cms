import { TextBlockBase } from "../text/text-block-base.js";
import {
  normalizeEditorInput,
  normalizeEditorParagraphs,
  syncEditorFromProperties,
} from "../text/text-editor-dom.js";
import { PARAGRAPH_RICH_TEXT_FEATURES } from "./rich-text-capabilities.js";
import { ENTER_ACTIONS, getEnterAction } from "../text/text-keyboard.js";
import { getSelectedAncestor, normalizeBlockContent } from "../text/text-utils.js";

export class RichTextBlock extends TextBlockBase {
  get paragraphMode() {
    return true;
  }

  get contentModel() {
    return "paragraph";
  }

  get supportedFeatures() {
    return PARAGRAPH_RICH_TEXT_FEATURES;
  }

  init(options = {}) {
    const { value = "" } = options;

    this.applyCommonOptions(options);
    this.type = "p";
    this.value = normalizeBlockContent(value, "p");
    this.fontSize = "";
    this.initializeEditorAfterUpdate();
    return this;
  }

  render() {
    return this.renderEditor("div");
  }

  toJSON() {
    return this.serializeBlock({ type: "p" });
  }

  handleEditorKeyDown(event) {
    if (event.key !== "Enter" || event.isComposing) return;

    const range = this.editorSelection?.rangeCount ? this.editorSelection.getRangeAt(0) : null;
    const isList = Boolean(getSelectedAncestor(event.currentTarget, range, "ul, ol"));
    if (isList && !event.shiftKey) return;

    event.preventDefault();
    const action = getEnterAction({ shiftKey: event.shiftKey });
    document.execCommand(
      action === ENTER_ACTIONS.paragraph ? "insertParagraph" : "insertLineBreak",
    );
    void this.updateComplete.then(() => {
      if (!this.editorElement) return;

      normalizeEditorParagraphs(this.editorElement, true);
      this.notifySelection();
    });
  }

  normalizeEditorInput(editor) {
    normalizeEditorInput(editor, true);
  }

  syncEditor({ preserveContent = false } = {}) {
    const editor = this.editorElement;
    if (!editor || this.renderRoot.activeElement === editor) return;

    syncEditorFromProperties(editor, {
      value: preserveContent ? editor.innerHTML : this.value,
      type: "p",
      paragraphMode: true,
      textAlign: this.textAlign,
      fontWeight: this.fontWeight,
      fontSize: "",
      fontFamily: this.fontFamily,
    });
  }
}

customElements.define("rich-text-block", RichTextBlock);
