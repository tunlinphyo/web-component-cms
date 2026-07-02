import { html } from "lit";
import { PopoverControl } from "./popover-control.js";
import { groupStyleSelectorStyles } from "../group-format-toolbar/group-style-selector.styles.js";
import { resolveConfigOptions } from "../../../customize/config/index.js";

export class BlockStyleSelector extends PopoverControl {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = groupStyleSelectorStyles;

  constructor() {
    super();
    this.value = "";
    this.disabled = true;
  }

  render() {
    return html`
      <label>
        <!-- ${this.label} -->
        <select .value=${this.value} ?disabled=${this.disabled} @change=${this.#change}>
          ${withCurrentOption(this.options, this.value).map(
            (option) => html`<option value=${option.value}>${option.label}</option>`,
          )}
        </select>
      </label>
    `;
  }

  #change = (event) => {
    this.value = event.currentTarget.value;
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "blockStyle", property: this.property, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

export class BlockBorderWidth extends BlockStyleSelector {
  label = "Border Width";
  property = "borderWidth";
  options = resolveConfigOptions("border-width");
}

export class BlockBorderStyle extends BlockStyleSelector {
  label = "Border Style";
  property = "borderStyle";
  options = resolveConfigOptions("border-style", [
    { value: "", label: "Default" },
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" },
  ]);

  render() {
    return html`
      <div class="border-style-group">
        <!-- <span>${this.label}</span> -->
        <button
          class="border-style-trigger"
          type="button"
          title=${this.#selectedLabel}
          popovertarget="border-styles"
          ?disabled=${this.disabled}
        >
          ${this.#preview(this.value)}
        </button>
      </div>
      <div id="border-styles" popover @toggle=${this.handlePopoverToggle}>
        ${this.options.map(
          ({ value, label }) => html`
            <button
              class="border-style-option"
              type="button"
              title=${label}
              aria-label=${label}
              aria-pressed=${this.value === value}
              @click=${() => this.#applyValue(value)}
            >
              ${this.#preview(value)}
            </button>
          `,
        )}
      </div>
    `;
  }

  get #selectedLabel() {
    return this.options.find((option) => option.value === this.value)?.label ?? "Default";
  }

  #preview(value) {
    if (!value || value === "none") {
      return html`<span class="border-style-none">None</span>`;
    }

    return html`
      <span
        class="border-style-preview"
        data-value=${value}
        style=${`--border-style: ${value}`}
      ></span>
    `;
  }

  #applyValue(value) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "blockStyle", property: this.property, value },
        bubbles: true,
        composed: true,
      }),
    );
    this.closePopover();
  }
}

class ImageBorderWidth extends BlockBorderWidth {}

class ImageBorderStyle extends BlockBorderStyle {}

class ImageBorderPosition extends BlockStyleSelector {
  label = "Border Position";
  property = "borderPosition";
  options = resolveConfigOptions("border-position", [
    { value: "", label: "All borders" },
    { value: "top", label: "Top border" },
    { value: "right", label: "Right border" },
    { value: "bottom", label: "Bottom border" },
    { value: "left", label: "Left border" },
  ]);

  render() {
    const selected = parseBorderPositions(this.value);

    return html`
      <div class="border-position-group" role="group" aria-label=${this.label}>
        ${this.options.map(
          ({ value, label }) => html`
            <button
              class="border-position-option"
              type="button"
              title=${label}
              aria-label=${label}
              aria-pressed=${value ? selected.has(value) : !this.value}
              data-position=${value || "all"}
              ?disabled=${this.disabled}
              @click=${() => this.#toggleValue(value)}
            >
              <span class="border-position-icon" aria-hidden="true"></span>
            </button>
          `,
        )}
      </div>
    `;
  }

  #toggleValue(value) {
    this.value = value ? toggleBorderPosition(this.value, value) : "";
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "blockStyle", property: this.property, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("image-border-width", ImageBorderWidth);
customElements.define("image-border-style", ImageBorderStyle);
customElements.define("image-border-position", ImageBorderPosition);

function parseBorderPositions(value) {
  return new Set(
    String(value || "")
      .split(/\s+/)
      .filter(Boolean),
  );
}

function withCurrentOption(options, value) {
  if (!value || options.some((option) => option.value === value)) return options;
  return [{ value, label: `Custom (${value})` }, ...options];
}

function toggleBorderPosition(current, position) {
  const positions = ["top", "right", "bottom", "left"];
  const selected = parseBorderPositions(current);

  if (selected.has(position)) selected.delete(position);
  else selected.add(position);

  const value = positions.filter((side) => selected.has(side));
  return !value.length || value.length === positions.length ? "" : value.join(" ");
}
