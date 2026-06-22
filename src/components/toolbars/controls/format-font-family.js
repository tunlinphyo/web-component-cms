import { LitElement, html } from "lit";
import { formatFontFamilyStyles } from "./format-font-family.styles.js";

const FONTS = [
  ["var(--font-heading)", "Heading Font"],
  ["var(--font-zen)", "Body Font"],
];

export class FormatFontFamily extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatFontFamilyStyles;

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
        title="Font family"
        aria-label="Font family"
        popovertarget="font-families"
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
      >
        ${this.#label(this.value)}
      </button>
      <div id="font-families" popover @toggle=${this.#toggle}>
        <div class="options">
          ${FONTS.map(
            ([fontFamily, label]) => html`
              <button
                type="button"
                data-value=${fontFamily}
                aria-pressed=${this.value === fontFamily}
                style="font-family: ${fontFamily}"
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
        detail: { command: "fontFamily", value: this.value },
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

  #label(fontFamily) {
    return FONTS.find(([value]) => value === fontFamily)?.[1] ?? "Font";
  }
}

customElements.define("format-font-family", FormatFontFamily);
