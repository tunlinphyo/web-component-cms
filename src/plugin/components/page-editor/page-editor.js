import { LitElement, html } from "lit";
import { EditorController } from "../../editor/editor-controller.js";

export class PageEditor extends LitElement {
  constructor() {
    super();
    this.controller = new EditorController(this);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const handleEvent = this.controller.handleEvent;

    return html`
      <group-order
        @selection-format-change=${handleEvent}
        @block-group-change=${handleEvent}
        @editor-change=${handleEvent}
        @image-change=${handleEvent}
        @button-icon-change=${handleEvent}
        @icon-change=${handleEvent}
        @input=${handleEvent}
        @keydown=${handleEvent}
        @mousedown=${handleEvent}
      ></group-order>

      <editor-toolbar
        @format-command=${handleEvent}
        @quill-format-command=${handleEvent}
        @element-type-change=${handleEvent}
        @group-style-change=${handleEvent}
        @block-group-command=${handleEvent}
        @restore-selection=${handleEvent}
        @keydown=${handleEvent}
        @mousedown=${handleEvent}
      >
        <group-format-toolbar title="Section"></group-format-toolbar>
        <format-toolbar title="Text"></format-toolbar>
      </editor-toolbar>
    `;
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

customElements.define("page-editor", PageEditor);
