import { LitElement, html } from "lit";
import { elementTypeSelectorStyles } from "./element-type-selector.styles.js";

export class ElementTypeSelector extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = elementTypeSelectorStyles;

  constructor() {
    super();
    this.value = "p";
    this.disabled = true;
  }

  updated(changedProperties) {
    if (changedProperties.has("disabled") && this.disabled) {
      const popover = this.renderRoot.querySelector("[popover]");
      if (popover?.matches(":popover-open")) popover.hidePopover();
    }
  }

  render() {
    return html`
      <button
        class="trigger"
        type="button"
        title="Element type"
        popovertarget="element-types"
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
      >
        ${this.value === "p" ? "Body" : this.value}
      </button>
      <div id="element-types" popover @toggle=${this.#toggle}>
        <div class="options">
          <button
            type="button"
            data-type="h1"
            aria-pressed=${this.value === "h1"}
            @click=${this.#change}
          >
            <span class="h1">Heading 1</span>
          </button>
          <button
            type="button"
            data-type="h2"
            aria-pressed=${this.value === "h2"}
            @click=${this.#change}
          >
            <span class="h2">Heading 2</span>
          </button>
          <button
            type="button"
            data-type="h3"
            aria-pressed=${this.value === "h3"}
            @click=${this.#change}
          >
            <span class="h3">Heading 3</span>
          </button>
          <button
            type="button"
            data-type="p"
            aria-pressed=${this.value === "p"}
            @click=${this.#change}
          >
            Body
          </button>
        </div>
      </div>
    `;
  }

  #change = (event) => {
    const value = event.currentTarget.dataset.type;
    this.renderRoot.querySelector("[popover]")?.hidePopover();
    if (value === this.value) return;

    this.value = value;
    this.dispatchEvent(
      new CustomEvent("element-type-change", {
        detail: { type: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #toggle = (event) => {
    if (event.newState !== "closed") return;

    this.dispatchEvent(
      new CustomEvent("restore-selection", {
        bubbles: true,
        composed: true,
      }),
    );
  };
}

customElements.define("element-type-selector", ElementTypeSelector);
