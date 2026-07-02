import { html, svg } from "lit";
import { FormatToggle } from "./format-toggle";

const unorderedListIcon = svg`
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
    <path
      d="M10 6h10M10 12h10M10 18h10"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
    />
    <path
      d="M5 6h.01M5 12h.01M5 18h.01"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="3"
    />
  </svg>
`;

export class FormatUnorderedList extends FormatToggle {
  command = "insertUnorderedList";

  render() {
    return html`<button
      type="button"
      title="Unordered list"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      ${unorderedListIcon}
    </button>`;
  }
}

customElements.define("format-unordered-list", FormatUnorderedList);
