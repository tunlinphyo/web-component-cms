import { LitElement, html } from "lit";
import { EDITOR_COLOR_SWATCHES_WITH_UNSET } from "../../../utils/colors.js";
import { groupStyleColorStyles } from "./group-style-color.styles.js";

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
                  @click=${() => this.#applyValue(color.value)}
                ></button>
              `,
        )}
      </div>
    `;
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
  label = "Background";
  property = "backgroundColor";
  fallback = "white";
  previewBorder = () => "currentColor";
  previewBackground = (color) => color;
}

class GroupBorderColor extends GroupStyleColor {
  label = "Border";
  property = "borderColor";
  fallback = "black";
  previewBorder = (color) => color;
  previewBackground = () => "white";
}

customElements.define("group-background-color", GroupBackgroundColor);
customElements.define("group-border-color", GroupBorderColor);

function isSelectedColor(current, value) {
  return current?.toLowerCase() === value.toLowerCase();
}
