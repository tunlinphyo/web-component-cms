import { LitElement, html } from "lit";
import { materialIconNames } from "../../../../customize/config/material-icons.js";
import {
  materialSymbolStyles,
  renderMaterialIcon,
  toMaterialIconName,
} from "../../icon-picker/material-icon-picker.js";
import { buttonBlockStyles } from "./button-block.styles.js";
import { getCapabilities, toFeatureAttribute } from "../../../registries/formatter-registry.js";

export class ButtonBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    text: { type: String },
    placeholder: { type: String },
    design: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    iconPosition: { type: String, attribute: "icon-position", reflect: true },
    link: { type: String },
    target: { type: String, reflect: true },
    align: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    features: { type: String, reflect: true },
  };

  static styles = [materialSymbolStyles, buttonBlockStyles];

  constructor() {
    super();
    this.blockId = "";
    this.text = "";
    this.placeholder = "Button";
    this.design = "primary";
    this.icon = "";
    this.iconPosition = "none";
    this.link = "";
    this.target = "_self";
    this.align = "left";
    this.disabled = false;
    this.features = undefined;
  }

  init(options = {}) {
    const {
      id = "",
      text = "",
      design = "primary",
      icon = "",
      iconPosition = icon ? "start" : "none",
      link = "",
      target = "_self",
      align = "left",
      disabled = false,
    } = options;

    this.blockId = id;
    this.text = text;
    this.design = design;
    this.icon = icon;
    this.iconPosition = icon ? iconPosition : "none";
    this.link = link;
    this.target = target || "_self";
    this.align = align;
    this.disabled = disabled;
    if (Object.hasOwn(options, "features")) {
      this.features = toFeatureAttribute(options.features);
    }
    return this;
  }

  toJSON() {
    return {
      id: this.blockId,
      text: this.text,
      design: this.design,
      icon: this.icon,
      iconPosition: this.iconPosition,
      link: this.link,
      target: this.link ? this.target : "_self",
      tag: this.link ? "a" : "button",
      align: this.align,
      disabled: this.disabled,
      type: "button",
    };
  }

  getSelectionFormat() {
    return {
      align: this.align,
      buttonDesign: this.design,
      buttonIconPlacement: this.icon ? this.iconPosition : "none",
      link: this.link,
      target: this.target,
      disabled: this.disabled,
      type: "button",
      capabilities: getCapabilities("button", this.features),
    };
  }

  setButtonDesign(design) {
    this.design = design;
    return true;
  }

  setButtonIconPlacement(placement) {
    if (placement === "none") {
      this.icon = "";
      this.iconPosition = "none";
      return true;
    }
    if (!["start", "end"].includes(placement)) return false;

    this.icon ||= materialIconNames[0];
    this.iconPosition = placement;
    return true;
  }

  setButtonLink(link) {
    this.link = link ?? "";
    if (!this.link) this.target = "_self";
    return true;
  }

  setButtonLinkTarget(target) {
    if (!["_self", "_blank"].includes(target)) return false;
    this.target = target;
    return true;
  }

  setDisabled(disabled) {
    this.disabled = Boolean(disabled);
    return true;
  }

  render() {
    return html`
      <span class="button" part="button">
        ${this.icon
          ? html`
              <button
                class="icon-picker-trigger"
                part="icon-picker-trigger"
                type="button"
                title="Choose button icon"
                aria-label="Choose button icon"
                popovertarget="button-icon-picker"
                ?disabled=${this.disabled}
              >
                ${renderMaterialIcon(toMaterialIconName(this.icon))}
              </button>
            `
          : null}
        <span
          class="text"
          role="textbox"
          aria-label=${this.placeholder}
          contenteditable=${this.disabled ? "false" : "plaintext-only"}
          data-placeholder=${this.placeholder}
          @keydown=${this.#keydown}
          @input=${this.#input}
        ></span>
      </span>
      <div id="button-icon-picker" popover>
        <material-icon-picker
          .value=${toMaterialIconName(this.icon)}
          @icon-select=${this.#changeIcon}
        ></material-icon-picker>
      </div>
    `;
  }

  firstUpdated() {
    this.#syncText();
  }

  updated(changedProperties) {
    if (changedProperties.has("icon") && !this.icon && this.iconPosition !== "none") {
      this.iconPosition = "none";
    }
    if (changedProperties.has("text") && this.renderRoot.activeElement !== this.#textElement) {
      this.#syncText();
    }
  }

  #changeIcon = (event) => {
    this.icon = event.detail.icon;
    this.renderRoot.querySelector("[popover]")?.hidePopover();
    this.dispatchEvent(
      new CustomEvent("button-icon-change", {
        detail: { id: this.blockId, icon: this.icon, iconPosition: this.iconPosition },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #input = (event) => {
    const text = event.currentTarget.textContent ?? "";
    this.text = text.trim() ? text : "";
    if (!this.text) event.currentTarget.replaceChildren();
  };

  #keydown = (event) => {
    if (event.key !== "Enter" || event.isComposing) return;
    event.preventDefault();
  };

  #syncText() {
    if (this.#textElement) this.#textElement.textContent = this.text;
  }

  get #textElement() {
    return this.renderRoot.querySelector(".text");
  }
}

customElements.define("button-block", ButtonBlock);
