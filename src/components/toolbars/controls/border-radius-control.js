import { LitElement, html } from "lit";
import { resolveConfigOptions } from "../../../customize/config/index.js";
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
    const options = resolveConfigOptions("border-radius");
    const cornerControls = [
      { label: "Top left", index: 0 },
      { label: "Top right", index: 1 },
      { label: "Bottom left", index: 3 },
      { label: "Bottom right", index: 2 },
    ];

    return html`
      <div class="heading">
        <span class="title">Border Radius</span>
        <label class="mode">
          <span>Custom corners</span>
          <input
            type="checkbox"
            role="switch"
            .checked=${this.custom}
            ?disabled=${this.disabled}
            @change=${this.#modeChange}
          />
        </label>
      </div>
      ${this.custom
        ? html`
            <div class="corners">
              ${cornerControls.map(
                ({ label, index }) => html`
                  <label>
                    ${label}
                    <select
                      .value=${corners[index]}
                      ?disabled=${this.disabled}
                      data-index=${index}
                      @change=${this.#cornerChange}
                    >
                      ${renderOptions(options, corners[index])}
                    </select>
                  </label>
                `,
              )}
            </div>
          `
        : html`
            <label class="all-corners">
              All corners
              <select .value=${corners[0]} ?disabled=${this.disabled} @change=${this.#allChange}>
                ${renderOptions(options, corners[0])}
              </select>
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
    this.#apply(event.currentTarget.value);
  };

  #cornerChange = (event) => {
    const corners = expandRadius(this.value);
    corners[Number(event.currentTarget.dataset.index)] = event.currentTarget.value;
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

function renderOptions(options, value) {
  const hasValue = options.some((option) => option.value === value);

  return [
    ...(!hasValue ? [html`<option value=${value}>Custom (${value})</option>`] : []),
    ...options.map((option) => html`<option value=${option.value}>${option.label}</option>`),
  ];
}

customElements.define("image-border-radius", ImageBorderRadius);
customElements.define("group-border-radius", GroupBorderRadius);
