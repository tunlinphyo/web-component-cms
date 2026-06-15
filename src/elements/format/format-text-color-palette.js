import { LitElement, html } from "lit";
import { formatTextColorPaletteStyles } from "./format-text-color-palette.styles.js";

const COLORS = [
  "text-white",
  "text-ink",
  "text-muted",
  "text-brand",
  "text-brand-dark",
  "text-coral",
  "text-gold",
  "text-leaf",
  "text-teal",
  "text-blue",
  "text-indigo",
  "text-purple",
  "text-brown",
];

export class FormatTextColorPalette extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    value: { type: String, reflect: true },
  };

  static styles = formatTextColorPaletteStyles;

  constructor() {
    super();
    this.disabled = false;
    this.value = "#000000";
  }

  render() {
    return html`
      <button
        class="trigger"
        type="button"
        title="Predefined text color"
        popovertarget="colors"
        ?disabled=${this.disabled}
        style=${`--text-color: ${this.value}`}
        @mousedown=${(event) => event.preventDefault()}
      >
        A
      </button>
      <div id="colors" popover>
        ${COLORS.map(
          (color) => html`
            <button
              class="color"
              type="button"
              title=${color}
              aria-label=${color}
              style=${`--color: var(--${color})`}
              @mousedown=${(event) => event.preventDefault()}
              @click=${() => this.#apply(color)}
            ></button>
          `,
        )}
      </div>
    `;
  }

  #apply(color) {
    const value = getComputedStyle(this).getPropertyValue(`--${color}`).trim();
    if (!value) return;

    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "foreColor", value },
        bubbles: true,
        composed: true,
      }),
    );
    queueMicrotask(() => {
      const popover = this.renderRoot.querySelector("[popover]");
      if (popover?.matches(":popover-open")) popover.hidePopover();
    });
  }
}

customElements.define("format-text-color-palette", FormatTextColorPalette);
