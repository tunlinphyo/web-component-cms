import { LitElement, css, html } from "lit";

export class ElementTypeSelector extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    button {
      box-sizing: border-box;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background: white;
      color: inherit;
      cursor: pointer;
      text-align: left;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    [popover] {
      position-anchor: --element-type-trigger;
      position-area: bottom;
      width: anchor-size(width);
      margin: 4px;
      padding: 4px;
      border: none;
      border-radius: 0.5rem;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }

    .trigger {
      anchor-name: --element-type-trigger;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      text-transform: uppercase;
    }

    .trigger::after {
      content: "";
      width: 0.35rem;
      height: 0.35rem;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: translateY(-25%) rotate(45deg);
    }

    .options {
      display: grid;
      gap: 4px;
    }

    .options button:hover,
    .options button[aria-pressed="true"] {
      background: var(--highlight);
      color: white;
    }

    .h1 {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .h2 {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .h3 {
      font-size: 1rem;
      font-weight: bold;
    }
  `;

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
        ${this.value === 'p' ? 'Body' : this.value}
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
