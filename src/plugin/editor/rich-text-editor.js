import { LitElement, html } from "lit";
import { EditorController } from "./editor-controller.js";

export class RichTextEditor extends LitElement {
  constructor() {
    super();
    this.controller = new EditorController(this);
  }

  render() {
    return html`<slot></slot>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.controller.connect();
  }

  disconnectedCallback() {
    this.controller.disconnect();
    super.disconnectedCallback();
  }

  init(pageData = {}) {
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
