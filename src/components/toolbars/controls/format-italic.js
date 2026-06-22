import { html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatItalic extends FormatToggle {
  command = "italic";

  render() {
    return html`<button
      type="button"
      title="Italic"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      <em>I</em>
    </button>`;
  }
}

customElements.define("format-italic", FormatItalic);
