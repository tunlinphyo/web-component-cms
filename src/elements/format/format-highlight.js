import { html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatHighlight extends FormatToggle {
  command = "highlight";

  render() {
    return html`<button
      type="button"
      title="Highlight"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      <mark>H</mark>
    </button>`;
  }
}

customElements.define("format-highlight", FormatHighlight);
