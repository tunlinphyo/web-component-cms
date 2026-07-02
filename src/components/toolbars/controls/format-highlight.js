import { css, html } from "lit";
import { FormatToggle } from "./format-toggle";

export class FormatHighlight extends FormatToggle {
  command = "highlight";

  static styles = [
    FormatToggle.styles,
    css`
      button {
        min-width: 64px;
        padding: 0 0.5rem;
      }

      mark {
        color: inherit;
        font-size: 0.75rem;
        line-height: 1;
      }
    `,
  ];

  render() {
    return html`<button
      type="button"
      title="Highlight"
      ?disabled=${this.disabled}
      @click=${() => this.apply()}
    >
      <mark>Highlight</mark>
    </button>`;
  }
}

customElements.define("format-highlight", FormatHighlight);
