import { LitElement, html } from "lit";
import {
  materialSymbolStyles,
  renderMaterialIcon,
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
    borderWidth: { type: String, attribute: "border-width", reflect: true },
    borderColor: { type: String, attribute: "border-color", reflect: true },
    borderStyle: { type: String, attribute: "border-style", reflect: true },
    borderPosition: { type: String, attribute: "border-position", reflect: true },
    borderRadius: { type: String, attribute: "border-radius", reflect: true },
    link: { type: String },
    target: { type: String, reflect: true },
    align: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    features: { type: String, reflect: true },
  };

  static styles = [materialSymbolStyles, iconBlockStyles];

  constructor() {
    super();
    this.blockId = "";
    this.icon = "";
    this.fontSize = "";
    this.color = "";
    this.backgroundColor = "";
    this.borderWidth = "";
    this.borderColor = "";
    this.borderStyle = "";
    this.borderPosition = "";
    this.borderRadius = "";
    this.link = "";
    this.target = "_self";
    this.align = "left";
    this.disabled = false;
    this.features = undefined;
  }

  init(options = {}) {
    const {
      id = "",
      icon = "",
      fontSize = "",
      color = "",
      backgroundColor = "",
      borderWidth = "",
      borderColor = "",
      borderStyle = "",
      borderPosition = "",
      borderRadius = "",
      link = "",
      target = "_self",
      align = "left",
      disabled = false,
    } = options;

    this.blockId = id;
    this.icon = icon;
    this.fontSize = fontSize;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.borderStyle = borderStyle;
    this.borderPosition = borderPosition;
    this.borderRadius = borderRadius;
    this.link = link;
    this.target = target || "_self";
    this.align = align;
    this.disabled = Boolean(disabled);
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
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderPosition: this.borderPosition,
      borderRadius: this.borderRadius,
      link: this.link,
      target: this.link ? this.target : "_self",
      align: this.align,
      disabled: this.disabled,
      type: "icon",
    };
  }

  getSelectionFormat() {
    return {
      align: this.align,
      color: this.color,
      backgroundColor: this.backgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderPosition: this.borderPosition,
      borderRadius: this.borderRadius,
      fontSize: this.fontSize,
      fontSizeApplied: Boolean(this.fontSize),
      link: this.link,
      target: this.target,
      disabled: this.disabled,
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

  setBorderRadius(borderRadius) {
    this.borderRadius = borderRadius;
    this.#dispatchSelectionFormat();
    return true;
  }

  setBlockStyle(property, value) {
    if (!["borderWidth", "borderColor", "borderStyle", "borderPosition"].includes(property)) {
      return false;
    }

    this[property] = value;
    if (property === "borderColor" && !value) {
      this.borderWidth = "";
      this.borderStyle = "";
    }
    if (property === "borderStyle" && (!value || value === "none")) {
      this.borderWidth = "";
      this.borderColor = "";
      this.borderPosition = "";
    }
    if (property === "borderWidth" && value && !this.borderStyle) this.borderStyle = "solid";
    if (property === "borderStyle" && value && value !== "none" && !this.borderWidth) {
      this.borderWidth = "1px";
    }
    this.#dispatchSelectionFormat();
    return true;
  }

  setIconLink(link) {
    this.link = link ?? "";
    if (!this.link) this.target = "_self";
    this.#dispatchSelectionFormat();
    return true;
  }

  setIconLinkTarget(target) {
    if (!["_self", "_blank"].includes(target)) return false;
    this.target = target;
    this.#dispatchSelectionFormat();
    return true;
  }

  setDisabled(disabled) {
    this.disabled = Boolean(disabled);
    this.#dispatchSelectionFormat();
    return true;
  }

  render() {
    const icon = this.icon;

    return html`
      <a
        class="input"
        href=${this.link || ""}
        target=${this.link ? this.target : "_self"}
        title="Choose icon"
        aria-label="Choose icon"
        ?data-empty=${!icon}
        part="container"
        style=${`font-size: ${this.fontSize}; color: ${this.color}; background-color: ${this.backgroundColor}; border-width: ${toBorderWidthValue(this.borderWidth, this.borderPosition)}; border-color: ${this.borderColor}; border-style: ${this.borderStyle}; border-radius: ${this.borderRadius};`}
        @click=${this.#openPicker}
      >
        ${renderMaterialIcon(icon)}
      </a>
      <div id="icon-picker" popover>
        <material-icon-picker .value=${icon} @icon-select=${this.#change}></material-icon-picker>
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

function toBorderWidthValue(width, position) {
  if (!width || !position) return width;

  const selected = new Set(String(position).split(/\s+/).filter(Boolean));
  const positions = ["top", "right", "bottom", "left"];
  if (!selected.size || positions.every((side) => selected.has(side))) return width;

  return positions.map((side) => (selected.has(side) ? width : "0")).join(" ");
}
