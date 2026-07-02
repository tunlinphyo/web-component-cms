import { html, svg } from "lit";
import { FormatToggle } from "./format-toggle";

const orderedListIcon = svg`
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
    <path
      d="M10 6h10M10 12h10M10 18h10"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
    />
    <path
      d="M4 5h1v4M4 9h2M4 11.5h2l-2 3h2M4 17h2l-2 2h2"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />
  </svg>
`;

export class FormatOrderedList extends FormatToggle {
  command = "insertOrderedList";

  render() {
    return html`<button
      type="button"
      title="Ordered list"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      ${orderedListIcon}
    </button>`;
  }
}

customElements.define("format-ordered-list", FormatOrderedList);
