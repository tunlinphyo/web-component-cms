import { css, html } from "lit";
import { BlockBorderStyle, BlockBorderWidth, BlockStyleSelector } from "./block-style-selector.js";
import { groupStyleSelectorStyles } from "../group-format-toolbar/group-style-selector.styles.js";

class TableBorderWidth extends BlockBorderWidth {}

class TableBorderStyle extends BlockBorderStyle {}

class TableBorderPosition extends BlockStyleSelector {
  static includeCurrentOption = false;
  static options = [
    { value: "", position: "both", label: "Horizontal and vertical borders" },
    { value: "horizontal", position: "horizontal", label: "Horizontal borders" },
    { value: "vertical", position: "vertical", label: "Vertical borders" },
  ];
  static styles = [
    groupStyleSelectorStyles,
    css`
      .border-position-group {
        grid-template-columns: repeat(3, 1fr);
      }

      .border-position-icon {
        position: relative;
        border: 1px solid var(--gray-300);
      }

      .border-position-icon::before,
      .border-position-icon::after {
        position: absolute;
        background: currentColor;
        content: "";
      }

      .border-position-option[data-position="horizontal"] .border-position-icon::before,
      .border-position-option[data-position="both"] .border-position-icon::before {
        top: 50%;
        right: 0;
        left: 0;
        height: 2px;
        translate: 0 -50%;
      }

      .border-position-option[data-position="vertical"] .border-position-icon::before,
      .border-position-option[data-position="both"] .border-position-icon::after {
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        translate: -50% 0;
      }
    `,
  ];

  label = "Border Position";
  property = "borderPosition";

  render() {
    return html`
      <div class="border-position-group" role="group" aria-label=${this.label}>
        ${this.options.map(
          ({ value, position, label }) => html`
            <button
              class="border-position-option"
              type="button"
              title=${label}
              aria-label=${label}
              aria-pressed=${this.value === value}
              data-position=${position}
              ?disabled=${this.disabled}
              @click=${() => this.#applyValue(value)}
            >
              <span class="border-position-icon" aria-hidden="true"></span>
            </button>
          `,
        )}
      </div>
    `;
  }

  #applyValue(value) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "blockStyle", property: this.property, value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("table-border-width", TableBorderWidth);
customElements.define("table-border-style", TableBorderStyle);
customElements.define("table-border-position", TableBorderPosition);
