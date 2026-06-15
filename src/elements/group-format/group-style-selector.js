import { LitElement, html } from "lit";
import { groupStyleSelectorStyles } from "./group-style-selector.styles.js";

class GroupStyleSelector extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = groupStyleSelectorStyles;

  constructor() {
    super();
    this.value = "";
    this.disabled = true;
  }

  render() {
    return html`
      <label>
        ${this.label}
        <select .value=${this.value} ?disabled=${this.disabled} @change=${this.#change}>
          ${this.options.map(([value, label]) => html`<option value=${value}>${label}</option>`)}
        </select>
      </label>
    `;
  }

  #change = (event) => {
    this.value = event.currentTarget.value;
    this.dispatchEvent(
      new CustomEvent("group-style-change", {
        detail: { property: this.property, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

class GroupBorderWidth extends GroupStyleSelector {
  label = "Width";
  property = "borderWidth";
  options = [
    ["", "Default"],
    ["1px", "1 px"],
    ["2px", "2 px"],
    ["3px", "3 px"],
    ["4px", "4 px"],
    ["6px", "6 px"],
    ["8px", "8 px"],
  ];
}

class GroupBorderStyle extends GroupStyleSelector {
  label = "Type";
  property = "borderStyle";
  options = [
    ["", "Default"],
    ["none", "None"],
    ["solid", "Solid"],
    ["dashed", "Dashed"],
    ["dotted", "Dotted"],
    ["double", "Double"],
  ];
}

customElements.define("group-border-width", GroupBorderWidth);
customElements.define("group-border-style", GroupBorderStyle);
