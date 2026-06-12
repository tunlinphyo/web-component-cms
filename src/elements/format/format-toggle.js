import { LitElement, css } from "lit";

export class FormatToggle extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    button {
      background: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      height: 32px;
      min-width: 32px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    :host([applied]) button {
      background: var(--highlight);
      color: white;
    }
  `;

  constructor() {
    super();
    this.applied = false;
    this.disabled = false;
  }

  apply() {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: this.command },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
