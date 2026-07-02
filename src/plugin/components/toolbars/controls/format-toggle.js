import { LitElement } from "lit";
import { formatToggleStyles } from "./format-toggle.styles.js";

export class FormatToggle extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatToggleStyles;

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
