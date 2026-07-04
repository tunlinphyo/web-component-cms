import { LitElement, html, nothing } from "lit";
import "../components/feedback/editor-toast.js";
import { EditorController } from "./editor-controller.js";
import { richTextEditorStyles } from "./rich-text-editor.styles.js";

export class RichTextEditor extends LitElement {
  static properties = {
    pickerDialog: { type: String, attribute: "picker-dialog" },
  };

  static styles = richTextEditorStyles;

  constructor() {
    super();
    this.pickerDialog = "";
    this.controller = new EditorController(this);
  }

  render() {
    return html`
      <section>
        <group-order picker-dialog=${this.pickerDialog || nothing}></group-order>
      </section>

      <nav>
        <group-format-toolbar title="Section"></group-format-toolbar>
        <format-toolbar title="Text"></format-toolbar>
      </nav>
      <editor-toast></editor-toast>
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
