import { LitElement, html } from "lit";
import { EDITOR_COLOR_SWATCHES } from "../../../utils/colors.js";
import { formatTextColorPaletteStyles } from "./format-text-color-palette.styles.js";

export class FormatIconBackgroundColor extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    value: { type: String, reflect: true },
  };

  static styles = formatTextColorPaletteStyles;

  constructor() {
    super();
    this.disabled = false;
    this.value = "#ffffff";
  }

  render() {
    return html`
      <button
        class="trigger"
        type="button"
        title="Predefined icon background color"
        popovertarget="colors"
        ?disabled=${this.disabled}
        style=${`--text-color: ${this.value}`}
        @mousedown=${(event) => event.preventDefault()}
      >
        BG
      </button>
      <div id="colors" popover>
        ${EDITOR_COLOR_SWATCHES.map((color) =>
          color.spacer
            ? html`<span class="spacer" aria-hidden="true"></span>`
            : html`
                <button
                  class="color"
                  type="button"
                  title=${`${color.label} ${color.value}`}
                  aria-label=${`${color.label} ${color.value}`}
                  aria-pressed=${isSelectedColor(this.value, color.value)}
                  style=${`--color: ${color.value}`}
                  @mousedown=${(event) => event.preventDefault()}
                  @click=${() => this.#apply(color.value)}
                ></button>
              `,
        )}
      </div>
    `;
  }

  #apply(value) {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "backgroundColor", value },
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

customElements.define("format-icon-background-color", FormatIconBackgroundColor);

function isSelectedColor(current, value) {
  return current?.toLowerCase() === value.toLowerCase();
}
