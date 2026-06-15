import { LitElement, html } from "lit";
import { groupStyleColorStyles } from "./group-style-color.styles.js";

const BACKGROUND_COLORS = [
  "background-white",
  "background-blush",
  "background-pink",
  "background-rose",
  "background-peach",
  "background-cream",
  "background-leaf",
  "background-mint",
  "background-cyan",
  "background-blue",
  "background-lilac",
  "background-gray",
];

const BORDER_COLORS = [
  "border-brand",
  "border-brand-dark",
  "border-pink",
  "border-coral",
  "border-gold",
  "border-leaf",
  "border-mint",
  "border-blue",
  "border-purple",
  "border-brown",
  "border-muted",
];

class GroupStyleColor extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = groupStyleColorStyles;

  constructor() {
    super();
    this.value = "";
    this.disabled = true;
  }

  render() {
    const color = this.value || this.fallback;

    return html`
      <span>${this.label}</span>
      <button
        class="trigger"
        type="button"
        title=${`Predefined ${this.label.toLowerCase()} color`}
        popovertarget="colors"
        ?disabled=${this.disabled}
      >
        <span
          class="preview"
          style=${`--preview-color: ${this.previewBorder(color)}; --preview-background: ${this.previewBackground(color)}`}
        ></span>
      </button>
      <div id="colors" popover>
        <button
          class="unset"
          type="button"
          title="Unset color"
          aria-label="Unset color"
          @click=${() => this.#applyValue("")}
        ></button>
        ${this.colors.map(
          (colorName) => html`
            <button
              class="color"
              type="button"
              title=${colorName}
              aria-label=${colorName}
              style=${`--color: var(--${colorName})`}
              @click=${() => this.#apply(colorName)}
            ></button>
          `,
        )}
      </div>
    `;
  }

  #apply(colorName) {
    const value = getComputedStyle(this).getPropertyValue(`--${colorName}`).trim();
    if (!value) return;

    this.#applyValue(value);
  }

  #applyValue(value) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("group-style-change", {
        detail: { property: this.property, value },
        bubbles: true,
        composed: true,
      }),
    );
    this.renderRoot.querySelector("[popover]")?.hidePopover();
  }
}

class GroupBackgroundColor extends GroupStyleColor {
  colors = BACKGROUND_COLORS;
  label = "Background";
  property = "backgroundColor";
  fallback = "white";
  previewBorder = () => "currentColor";
  previewBackground = (color) => color;
}

class GroupBorderColor extends GroupStyleColor {
  colors = BORDER_COLORS;
  label = "Border";
  property = "borderColor";
  fallback = "black";
  previewBorder = (color) => color;
  previewBackground = () => "white";
}

customElements.define("group-background-color", GroupBackgroundColor);
customElements.define("group-border-color", GroupBorderColor);
