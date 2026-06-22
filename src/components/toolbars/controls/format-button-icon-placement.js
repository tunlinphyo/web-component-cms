import { LitElement, html } from "lit";
import { formatButtonIconPlacementStyles } from "./format-button-icon-placement.styles.js";

const PLACEMENTS = [
  ["none", "Icon none"],
  ["start", "Icon Start"],
  ["end", "Icon End"],
];

export class FormatButtonIconPlacement extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatButtonIconPlacementStyles;

  constructor() {
    super();
    this.value = "none";
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
        title="Button icon"
        popovertarget="button-icon-placements"
        ?disabled=${this.disabled}
      >
        ${this.#label(this.value)}
      </button>
      <div id="button-icon-placements" popover>
        <div class="options">
          ${PLACEMENTS.map(
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
        detail: { command: "buttonIconPlacement", value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #label(value) {
    return PLACEMENTS.find(([placement]) => placement === value)?.[1] ?? "Button icon";
  }
}

customElements.define("format-button-icon-placement", FormatButtonIconPlacement);
