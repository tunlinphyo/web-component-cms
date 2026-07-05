import { css, html } from "lit";
import {
  materialSymbolStyles,
  renderMaterialIcon,
} from "../../icon-picker/material-icon-picker.js";
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
    materialSymbolStyles,
    css`
      .border-position-group {
        grid-template-columns: repeat(3, 1fr);
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
              ${renderMaterialIcon(position === "both" ? "border_all" : `border_${position}`)}
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
