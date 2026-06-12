import { LitElement, css } from "lit";

export class FormatToggle extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = css`
    button {
      background: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      height: 32px;
      min-width: 32px;

    }

    button:disabled {
      opacity: 0.5;
    }

    :host([applied]) button {
      background: var(--highlight);
      color: white;
    }

    mark {
      background-color: var(--highlight);
      padding-inline: 0.25rem;
      border-radius: 2px;
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
