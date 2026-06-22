import { html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatOrderedList extends FormatToggle {
  command = "insertOrderedList";

  render() {
    return html`<button
      type="button"
      title="Ordered list"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      1.
    </button>`;
  }
}

customElements.define("format-ordered-list", FormatOrderedList);
