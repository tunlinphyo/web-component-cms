import { LitElement, html } from "lit";

export class ElementTypeSelector extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.value = "p";
    this.disabled = false;
  }

  render() {
    return html`
      <select
        title="Element type"
        .value=${this.value}
        ?disabled=${this.disabled}
        @change=${this.#change}
      >
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="p">Paragraph</option>
      </select>
    `;
  }

  #change = (event) => {
    this.value = event.target.value;
    this.dispatchEvent(
      new CustomEvent("element-type-change", {
        detail: { type: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

customElements.define("element-type-selector", ElementTypeSelector);
