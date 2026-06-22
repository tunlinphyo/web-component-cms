import { html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatDisabled extends FormatToggle {
  command = "disabled";

  render() {
    return html`<button
      type="button"
      title=${this.applied ? "Enable" : "Disable"}
      aria-label=${this.applied ? "Enable" : "Disable"}
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M5.6 5.6 18.4 18.4" />
      </svg>
    </button>`;
  }
}

customElements.define("format-disabled", FormatDisabled);
