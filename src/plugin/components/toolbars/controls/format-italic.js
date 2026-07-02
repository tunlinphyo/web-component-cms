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
      <svg viewBox="0 0 24 24" width="16">
        <g stroke-linecap="round" stroke="currentColor" stroke-width="2">
          <line x1="10" y1="6" x2="18" y2="6"></line>
          <line x1="6" y1="18" x2="14" y2="18"></line>
          <line x1="14" y1="7" x2="10" y2="17"></line>
        </g>
      </svg>
    </button>`;
  }
}

customElements.define("format-italic", FormatItalic);
