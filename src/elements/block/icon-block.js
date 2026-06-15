import { LitElement, html } from "lit";
import { iconBlockStyles } from "./icon-block.styles.js";
import { ICONS } from "./icons.js";

export class IconBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    icon: { type: String, reflect: true },
    fontSize: { type: String, attribute: "font-size", reflect: true },
    color: { type: String, reflect: true },
    backgroundColor: { type: String, attribute: "background-color", reflect: true },
    link: { type: String },
    align: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = iconBlockStyles;

  constructor() {
    super();
    this.blockId = "";
    this.icon = "plus";
    this.fontSize = "";
    this.color = "";
    this.backgroundColor = "";
    this.link = "";
    this.align = "left";
    this.disabled = false;
  }

  init({
    id = "",
    icon = "plus",
    fontSize = "",
    color = "",
    backgroundColor = "",
    link = "",
    align = "left",
  } = {}) {
    this.blockId = id;
    this.icon = icon;
    this.fontSize = fontSize;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.link = link;
    this.align = align;
    return this;
  }

  toJSON() {
    return {
      id: this.blockId,
      icon: this.icon,
      fontSize: this.fontSize,
      color: this.color,
      backgroundColor: this.backgroundColor,
      link: this.link,
      align: this.align,
      type: "icon",
    };
  }

  getSelectionFormat() {
    return {
      align: this.align,
      color: this.color,
      backgroundColor: this.backgroundColor,
      fontSize: this.fontSize,
      fontSizeApplied: Boolean(this.fontSize),
      link: this.link,
      type: "icon",
    };
  }

  formatSelection(command, value = null) {
    if (command === "fontSize") this.fontSize = value ?? "";
    else if (command === "foreColor") this.color = value ?? "";
    else if (command === "backgroundColor") this.backgroundColor = value ?? "";
    else if (command === "link") this.link = value ?? "";
    else if (command !== "linkEdit" && command !== "linkCancel") return false;

    this.#dispatchSelectionFormat();
    return true;
  }

  render() {
    return html`
      <a
        class="input"
        href=${this.link || ""}
        title="Choose icon"
        aria-label="Choose icon"
        part="container"
        style=${`font-size: ${this.fontSize}; color: ${this.color}; background-color: ${this.backgroundColor};`}
        @click=${this.#openPicker}
      >
        ${ICONS.find(({ value }) => value === this.icon)?.svg}
      </a>
      <div id="icon-picker" popover>
        <div class="options">
          ${ICONS.map(
            ({ value, label, svg }) => html`
              <button
                type="button"
                title=${label}
                aria-label=${label}
                aria-pressed=${this.icon === value}
                data-value=${value}
                @click=${this.#change}
              >
                ${svg}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }

  #change = (event) => {
    this.icon = event.currentTarget.dataset.value;
    this.renderRoot.querySelector("[popover]")?.hidePopover();
    this.dispatchEvent(
      new CustomEvent("icon-change", {
        detail: { id: this.blockId, icon: this.icon },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #openPicker = (event) => {
    event.preventDefault();
    if (this.disabled) return;
    this.renderRoot.querySelector("[popover]")?.showPopover();
  };

  #dispatchSelectionFormat() {
    this.dispatchEvent(
      new CustomEvent("selection-format-change", {
        detail: this.getSelectionFormat(),
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("icon-block", IconBlock);
