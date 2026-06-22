import { html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatUnorderedList extends FormatToggle {
  command = "insertUnorderedList";

  render() {
    return html`<button
      type="button"
      title="Unordered list"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      •
    </button>`;
  }
}

customElements.define("format-unordered-list", FormatUnorderedList);
