import { css, html, unsafeCSS } from "lit";
import markStyles from "../../../../styles/mark.css?inline";
import { FormatToggle } from "./format-toggle";

export class FormatHighlight extends FormatToggle {
  command = "highlight";

  static styles = [
    FormatToggle.styles,
    unsafeCSS(markStyles),
    css`
      button {
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
      <mark>Mark</mark>
    </button>`;
  }
}

customElements.define("format-highlight", FormatHighlight);
