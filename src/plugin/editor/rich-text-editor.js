import { LitElement, html } from "lit";
import { EditorController } from "./editor-controller.js";
import { richTextEditorStyles } from "./rich-text-editor.styles.js";

export class RichTextEditor extends LitElement {
  static styles = richTextEditorStyles;

  constructor() {
    super();
    this.controller = new EditorController(this);
  }

  render() {
    return html`
      <section>
        <group-order picker-dialog="custom-group-picker-dialog"></group-order>
      </section>

      <nav>
        <group-format-toolbar title="Section"></group-format-toolbar>
        <format-toolbar title="Text"></format-toolbar>
      </nav>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.controller.connect();
  }

  disconnectedCallback() {
    this.controller.disconnect();
    super.disconnectedCallback();
  }

  async init(pageData = {}) {
    await this.updateComplete;
    return this.controller.init(pageData);
  }

  toJSON() {
    return this.controller.toJSON();
  }

  undo() {
    return this.controller.undo();
  }

  redo() {
    return this.controller.redo();
  }

  get canUndo() {
    return this.controller.canUndo;
  }

  get canRedo() {
    return this.controller.canRedo;
  }
}

customElements.define("rich-text-editor", RichTextEditor);
