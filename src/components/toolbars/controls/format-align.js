import { html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatAlign extends FormatToggle {
  render() {
    return html`<button
      type="button"
      title=${this.label}
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      ${this.icon}
    </button>`;
  }
}
