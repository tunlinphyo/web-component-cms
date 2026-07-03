import { LitElement, html } from "lit";
import { elementTypeOptions } from "../../../../../customize/config/element-type.js";
import { fontFamilyOptions } from "../../../../../customize/config/font-family.js";
import { fontSizeOptions } from "../../../../../customize/config/font-size.js";
import { linkTargetOptions } from "../../../../../customize/config/link-target.js";
import { EDITOR_COLOR_SWATCHES_WITH_UNSET } from "../../../../utils/colors.js";
import { elementTypeSelectorStyles } from "../element-type-selector.styles.js";
import { formatColorStyles } from "../format-color.styles.js";
import { formatLinkStyles } from "../format-link.styles.js";
import { formatTextColorPaletteStyles } from "../format-text-color-palette.styles.js";
import { formatToggleStyles } from "../format-toggle.styles.js";
import { pickerPopoverControlStyles } from "../picker-popover-control.styles.js";

function dispatchFormat(control, format, value) {
  control.dispatchEvent(
    new CustomEvent("quill-format-command", {
      bubbles: true,
      composed: true,
      detail: { format, value },
    }),
  );
}

class QuillToggle extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
  };

  static styles = formatToggleStyles;
  static format = "";
  static label = "";

  constructor() {
    super();
    this.applied = false;
    this.disabled = false;
  }

  get formatValue() {
    return !this.applied;
  }

  renderLabel() {
    return this.constructor.label;
  }

  render() {
    return html`
      <button
        type="button"
        title=${this.constructor.label}
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
        @click=${() => dispatchFormat(this, this.constructor.format, this.formatValue)}
      >
        ${this.renderLabel()}
      </button>
    `;
  }
}

class QuillPicker extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    value: { type: String, reflect: true },
  };

  static styles = pickerPopoverControlStyles;
  static options = [];
  static format = "";
  static title = "";

  constructor() {
    super();
    this.disabled = false;
    this.value = "";
  }

  get selectedOption() {
    return this.constructor.options.find((option) => option.value === this.value);
  }

  toFormatValue(value) {
    return value || false;
  }

  render() {
    return html`
      <button
        class="trigger"
        type="button"
        popovertarget="options"
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
      >
        ${this.selectedOption?.label ?? this.constructor.title}
      </button>
      <div id="options" popover>
        <div class="options">
          ${this.constructor.options.map(
            (option) => html`
              <button
                type="button"
                class=${option.className ?? ""}
                style=${option.style ?? ""}
                aria-pressed=${option.value === this.value}
                @mousedown=${(event) => event.preventDefault()}
                @click=${() => {
                  this.value = option.value;
                  dispatchFormat(this, this.constructor.format, this.toFormatValue(option.value));
                  this.renderRoot.querySelector("[popover]")?.hidePopover();
                }}
              >
                ${option.label}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

class QuillElementType extends QuillPicker {
  static styles = [pickerPopoverControlStyles, elementTypeSelectorStyles];
  static options = elementTypeOptions;
  static format = "header";
  static title = "Element type";

  toFormatValue(value) {
    return value === "p" ? false : Number(value.slice(1));
  }
}

class QuillFontFamily extends QuillPicker {
  static options = fontFamilyOptions;
  static format = "font";
  static title = "Font";
}

class QuillFontSize extends QuillPicker {
  static options = fontSizeOptions;
  static format = "size";
  static title = "Default";
}

class QuillBold extends QuillToggle {
  static format = "bold";
  static label = "Bold";

  renderLabel() {
    return html`<strong>B</strong>`;
  }
}

class QuillItalic extends QuillToggle {
  static format = "italic";
  static label = "Italic";

  renderLabel() {
    return html`<em>I</em>`;
  }
}

class QuillUnderline extends QuillToggle {
  static format = "underline";
  static label = "Underline";

  renderLabel() {
    return html`<u>U</u>`;
  }
}

class QuillList extends QuillToggle {
  static format = "list";
  static value = "";

  get formatValue() {
    return this.applied ? false : this.constructor.value;
  }
}

class QuillOrderedList extends QuillList {
  static label = "Ordered list";
  static value = "ordered";
}

class QuillUnorderedList extends QuillList {
  static label = "Unordered list";
  static value = "bullet";
}

class QuillAlign extends QuillToggle {
  static format = "align";
  static value = "";

  get formatValue() {
    return this.constructor.value || false;
  }
}

class QuillAlignLeft extends QuillAlign {
  static label = "Align left";
  static value = "";
}

class QuillAlignCenter extends QuillAlign {
  static label = "Align center";
  static value = "center";
}

class QuillAlignRight extends QuillAlign {
  static label = "Align right";
  static value = "right";
}

class QuillAlignJustify extends QuillAlign {
  static label = "Justify";
  static value = "justify";
}

class QuillHighlight extends QuillToggle {
  static format = "background";
  static label = "Highlight";

  get formatValue() {
    return this.applied ? false : "#fff59d";
  }

  renderLabel() {
    return html`<mark>Highlight</mark>`;
  }
}

class QuillTextColor extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    value: { type: String },
  };

  static styles = formatColorStyles;

  constructor() {
    super();
    this.disabled = false;
    this.value = "#000000";
  }

  render() {
    return html`
      <label>
        Color
        <input
          type="color"
          .value=${this.value}
          ?disabled=${this.disabled}
          @input=${(event) => dispatchFormat(this, "color", event.currentTarget.value)}
        />
      </label>
    `;
  }
}

class QuillColorPalette extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    value: { type: String },
  };

  static styles = formatTextColorPaletteStyles;

  constructor() {
    super();
    this.disabled = false;
    this.value = "#000000";
  }

  render() {
    return html`
      <div class="label-group">
        <span>Text Color</span>
        <button
          class="trigger"
          type="button"
          popovertarget="colors"
          ?disabled=${this.disabled}
          style=${`--text-color: ${this.value}`}
          @mousedown=${(event) => event.preventDefault()}
        >
          <span
            class="selected-color"
            style=${this.value ? `background: ${this.value}` : ""}
          ></span>
        </button>
      </div>
      <div id="colors" popover>
        <button
          class="unset"
          type="button"
          @mousedown=${(event) => event.preventDefault()}
          @click=${() => this.#apply(false)}
        ></button>
        ${EDITOR_COLOR_SWATCHES_WITH_UNSET.map((color) =>
          color.spacer
            ? html`<span class="spacer"></span>`
            : html`
                <button
                  class="color"
                  type="button"
                  style=${`--color: ${color.value}`}
                  aria-pressed=${color.value.toLowerCase() === this.value?.toLowerCase()}
                  @mousedown=${(event) => event.preventDefault()}
                  @click=${() => this.#apply(color.value)}
                ></button>
              `,
        )}
      </div>
    `;
  }

  #apply(value) {
    dispatchFormat(this, "color", value);
    this.renderRoot.querySelector("[popover]")?.hidePopover();
  }
}

class QuillLink extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
    value: { type: String },
  };

  static styles = formatLinkStyles;

  constructor() {
    super();
    this.applied = false;
    this.disabled = false;
    this.value = "";
  }

  render() {
    return html`
      <button
        type="button"
        title="Link"
        popovertarget="link"
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
      >
        Link
      </button>
      <div id="link" popover>
        <form
          @submit=${(event) => {
            event.preventDefault();
            const value = event.currentTarget.elements.url.value.trim();
            if (value) dispatchFormat(this, "link", value);
            this.renderRoot.querySelector("[popover]")?.hidePopover();
          }}
        >
          <input name="url" type="url" .value=${this.value} required />
          <button class="btn-save" type="submit">Save</button>
          <button
            class="btn-remove"
            type="button"
            @click=${() => dispatchFormat(this, "link", false)}
          >
            Remove
          </button>
        </form>
      </div>
    `;
  }
}

class QuillLinkTarget extends QuillPicker {
  static options = linkTargetOptions;
  static format = "linkTarget";
  static title = "Link target";
}

for (const [tagName, Formatter] of [
  ["quill-element-type-selector", QuillElementType],
  ["quill-format-font-family", QuillFontFamily],
  ["quill-format-font-size", QuillFontSize],
  ["quill-format-bold", QuillBold],
  ["quill-format-italic", QuillItalic],
  ["quill-format-underline", QuillUnderline],
  ["quill-format-ordered-list", QuillOrderedList],
  ["quill-format-unordered-list", QuillUnorderedList],
  ["quill-format-align-left", QuillAlignLeft],
  ["quill-format-align-center", QuillAlignCenter],
  ["quill-format-align-right", QuillAlignRight],
  ["quill-format-align-justify", QuillAlignJustify],
  ["quill-format-highlight", QuillHighlight],
  ["quill-format-link", QuillLink],
  ["quill-format-link-target", QuillLinkTarget],
  ["quill-format-text-color", QuillTextColor],
  ["quill-format-text-color-palette", QuillColorPalette],
]) {
  customElements.define(tagName, Formatter);
}
