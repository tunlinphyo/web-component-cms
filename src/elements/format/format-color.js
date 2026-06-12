import { LitElement, html, css } from "lit";

export class FormatColor extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = css`
    label {
      align-items: center;
      display: flex;
      gap: 4px;
    }

    input {
      cursor: pointer;
      height: 28px;
      padding: 0;
      width: 32px;
    }
  `;

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
