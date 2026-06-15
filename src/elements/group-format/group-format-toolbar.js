import { LitElement, html } from "lit";

const CONTROLS = [
  ["group-background-color", "backgroundColor"],
  ["group-border-width", "borderWidth"],
  ["group-border-color", "borderColor"],
  ["group-border-style", "borderStyle"],
  ["group-border-radius", "borderRadius"],
];

export class GroupFormatToolbar extends LitElement {
  render() {
    return html`<slot></slot>`;
  }

  firstUpdated() {
    for (const [selector] of CONTROLS) this.#setDisabled(selector, true);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("group-format-change", this.#groupFormatChange);
  }

  disconnectedCallback() {
    this.removeEventListener("group-format-change", this.#groupFormatChange);
    super.disconnectedCallback();
  }

  #groupFormatChange = (event) => {
    for (const [selector, property] of CONTROLS) {
      this.#setValue(selector, event.detail?.[property] ?? "");
      this.#setDisabled(selector, !event.detail);
    }
  };

  #setValue(selector, value) {
    const control = this.querySelector(selector);
    if (control) control.value = value;
  }

  #setDisabled(selector, disabled) {
    const control = this.querySelector(selector);
    if (control) control.disabled = disabled;
  }
}

customElements.define("group-format-toolbar", GroupFormatToolbar);
