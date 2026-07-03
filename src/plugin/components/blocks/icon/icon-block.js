import { LitElement, html } from "lit";
import {
  materialSymbolStyles,
  renderMaterialIcon,
  toMaterialIconName,
} from "../../icon-picker/material-icon-picker.js";
import { iconBlockStyles } from "./icon-block.styles.js";
import { getCapabilities, toFeatureAttribute } from "../../../registries/formatter-registry.js";

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
    features: { type: String, reflect: true },
  };

  static styles = [materialSymbolStyles, iconBlockStyles];

  constructor() {
    super();
    this.blockId = "";
    this.icon = "add";
    this.fontSize = "";
    this.color = "";
    this.backgroundColor = "";
    this.link = "";
    this.align = "left";
    this.disabled = false;
    this.features = undefined;
  }

  init(options = {}) {
    const {
      id = "",
      icon = "add",
      fontSize = "",
      color = "",
      backgroundColor = "",
      link = "",
      align = "left",
    } = options;

    this.blockId = id;
    this.icon = icon;
    this.fontSize = fontSize;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.link = link;
    this.align = align;
    if (Object.hasOwn(options, "features")) {
      this.features = toFeatureAttribute(options.features);
    }
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
      capabilities: getCapabilities("icon", this.features),
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
        ${renderMaterialIcon(toMaterialIconName(this.icon))}
      </a>
      <div id="icon-picker" popover>
        <material-icon-picker
          .value=${toMaterialIconName(this.icon)}
          @icon-select=${this.#change}
        ></material-icon-picker>
      </div>
    `;
  }

  #change = (event) => {
    this.icon = event.detail.icon;
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
