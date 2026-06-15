import { LitElement, html } from "lit";
import { formatFontSizeStyles } from "./format-font-size.styles.js";

const FONT_SIZES = ["", "10px", "12px", "14px", "16px", "18px", "20px", "24px", "32px", "40px"];

export class FormatFontSize extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatFontSizeStyles;

  constructor() {
    super();
    this.value = "";
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
        title="Font size"
        aria-label="Font size"
        popovertarget="font-sizes"
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
      >
        ${this.#label(this.value)}
      </button>
      <div id="font-sizes" popover @toggle=${this.#toggle}>
        <div class="options">
          ${FONT_SIZES.map(
      (fontSize) => html`
              <button
                type="button"
                data-value=${fontSize}
                aria-pressed=${this.value === fontSize}
                @click=${this.#change}
              >
                ${this.#label(fontSize)}
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
        detail: { command: "fontSize", value: this.value },
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

  #label(fontSize) {
    return fontSize ? fontSize.replace("px", " px") : "Default";
  }
}

customElements.define("format-font-size", FormatFontSize);
