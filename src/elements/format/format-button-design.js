import { LitElement, html } from "lit";
import { formatButtonDesignStyles } from "./format-button-design.styles.js";

const DESIGNS = [
  ["primary", "Primary"],
  ["dark", "Dark"],
  ["outline", "Outline"],
  ["soft", "Soft"],
  ["nav", "Navigation"],
];

export class FormatButtonDesign extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatButtonDesignStyles;

  constructor() {
    super();
    this.value = "primary";
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
        title="Button design"
        popovertarget="button-designs"
        ?disabled=${this.disabled}
      >
        ${this.#label(this.value)}
      </button>
      <div id="button-designs" popover>
        <div class="options">
          ${DESIGNS.map(
      ([value, label]) => html`
              <button
                type="button"
                data-value=${value}
                aria-pressed=${this.value === value}
                @click=${this.#change}
              >
                ${label}
              </button>
            `,
    )}
        </div>
      </div>
    `;
  }

  #change = (event) => {
    const value = event.currentTarget.dataset.value;
    this.renderRoot.querySelector("[popover]")?.hidePopover();
    if (value === this.value) return;

    this.value = value;
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "buttonDesign", value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #label(value) {
    return DESIGNS.find(([design]) => design === value)?.[1] ?? "Button design";
  }
}

customElements.define("format-button-design", FormatButtonDesign);
