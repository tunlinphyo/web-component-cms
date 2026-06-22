import { LitElement, html } from "lit";
import { EDITOR_COLOR_SWATCHES_WITH_UNSET } from "../../../utils/colors.js";
import { formatTextColorPaletteStyles } from "./format-text-color-palette.styles.js";

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
        <button
          class="unset"
          type="button"
          title="Unset color"
          aria-label="Unset color"
          aria-pressed=${!this.value}
          @mousedown=${(event) => event.preventDefault()}
          @click=${() => this.#apply("")}
        ></button>
        ${EDITOR_COLOR_SWATCHES_WITH_UNSET.map((color) =>
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

function isSelectedColor(current, value) {
  return current?.toLowerCase() === value.toLowerCase();
}
