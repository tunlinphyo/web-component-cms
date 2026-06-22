import { LitElement, html } from "lit";
import { groupStyleSelectorStyles } from "../group-format-toolbar/group-style-selector.styles.js";

export class FormatImageLinkTarget extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = groupStyleSelectorStyles;

  constructor() {
    super();
    this.value = "_self";
    this.disabled = true;
  }

  render() {
    return html`
      <label>
        Link opens
        <select .value=${this.value || "_self"} ?disabled=${this.disabled} @change=${this.#change}>
          <option value="_self">Same tab</option>
          <option value="_blank">New tab</option>
        </select>
      </label>
    `;
  }

  #change = (event) => {
    this.value = event.currentTarget.value;
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "imageLinkTarget", value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

customElements.define("format-image-link-target", FormatImageLinkTarget);
