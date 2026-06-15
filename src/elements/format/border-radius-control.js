import { LitElement, html } from "lit";
import { borderRadiusControlStyles } from "./border-radius-control.styles.js";

class BorderRadiusControl extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
    custom: { type: Boolean, reflect: true },
  };

  static styles = borderRadiusControlStyles;

  constructor() {
    super();
    this.value = "";
    this.disabled = true;
    this.custom = false;
  }

  updated(changedProperties) {
    if (changedProperties.has("value")) {
      this.custom = this.value.trim().split(/\s+/).filter(Boolean).length > 1;
    }
  }

  render() {
    const corners = expandRadius(this.value);

    return html`
      <div class="heading">
        <span>Radius</span>
        <label class="mode">
          <input
            type="checkbox"
            .checked=${this.custom}
            ?disabled=${this.disabled}
            @change=${this.#modeChange}
          />
          Custom corners
        </label>
      </div>
      ${this.custom
        ? html`
            <div class="corners">
              ${["Top left", "Top right", "Bottom right", "Bottom left"].map(
                (label, index) => html`
                  <label>
                    ${label}
                    <input
                      type="number"
                      min="0"
                      step="1"
                      .value=${toNumber(corners[index])}
                      ?disabled=${this.disabled}
                      data-index=${index}
                      @change=${this.#cornerChange}
                    />
                  </label>
                `,
              )}
            </div>
          `
        : html`
            <label>
              All corners
              <input
                type="number"
                min="0"
                step="1"
                .value=${toNumber(corners[0])}
                ?disabled=${this.disabled}
                @change=${this.#allChange}
              />
            </label>
          `}
    `;
  }

  #modeChange = (event) => {
    this.custom = event.currentTarget.checked;
    const corners = expandRadius(this.value);
    this.#apply(this.custom ? corners.join(" ") : corners[0]);
  };

  #allChange = (event) => {
    this.#apply(toPx(event.currentTarget.value));
  };

  #cornerChange = (event) => {
    const corners = expandRadius(this.value);
    corners[Number(event.currentTarget.dataset.index)] = toPx(event.currentTarget.value);
    this.#apply(corners.join(" "));
  };

  #apply(value) {
    this.value = value;
    this.dispatchChange(value);
  }
}

class ImageBorderRadius extends BorderRadiusControl {
  dispatchChange(value) {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "borderRadius", value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

class GroupBorderRadius extends BorderRadiusControl {
  dispatchChange(value) {
    this.dispatchEvent(
      new CustomEvent("group-style-change", {
        detail: { property: "borderRadius", value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

function expandRadius(value) {
  const values = value.trim().split(/\s+/).filter(Boolean);

  if (values.length === 2) return [values[0], values[1], values[0], values[1]];
  if (values.length === 3) return [values[0], values[1], values[2], values[1]];
  if (values.length >= 4) return values.slice(0, 4);

  const radius = values[0] ?? "0px";
  return [radius, radius, radius, radius];
}

function toNumber(value) {
  return String(Number.parseFloat(value) || 0);
}

function toPx(value) {
  return `${Math.max(0, Number(value) || 0)}px`;
}

customElements.define("image-border-radius", ImageBorderRadius);
customElements.define("group-border-radius", GroupBorderRadius);
