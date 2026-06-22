import { LitElement, html } from "lit";
import { formatColorStyles } from "./format-color.styles.js";

export class FormatColor extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatColorStyles;

  apply(event) {
    this.value = event.currentTarget.value;
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: this.command, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`<label>
      ${this.label}
      <input
        type="color"
        .value=${this.value}
        ?disabled=${this.disabled}
        @input=${(event) => this.apply(event)}
      />
    </label>`;
  }
}
