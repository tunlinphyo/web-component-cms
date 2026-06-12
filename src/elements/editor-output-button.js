import { LitElement, html } from "lit";

export class EditorOutputButton extends LitElement {
  render() {
    return html`<button type="button" @click=${this.#output}>Log Output</button>`;
  }

  #output() {
    const editor = this.closest("rich-text-editor");
    if (editor) console.log(editor.toJSON());
  }
}

customElements.define("editor-output-button", EditorOutputButton);
