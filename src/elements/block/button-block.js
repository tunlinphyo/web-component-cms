import { LitElement, html } from "lit";
import { buttonBlockStyles } from "./button-block.styles.js";
import { ICONS } from "./icons.js";

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
  };

  static styles = buttonBlockStyles;

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
  }

  init({
    id = "",
    text = "",
    design = "primary",
    icon = "",
    iconPosition = icon ? "start" : "none",
    link = "",
    target = "_self",
    align = "left",
  } = {}) {
    this.blockId = id;
    this.text = text;
    this.design = design;
    this.icon = icon;
    this.iconPosition = icon ? iconPosition : "none";
    this.link = link;
    this.target = target || "_self";
    this.align = align;
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
      type: "button",
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

    this.icon ||= ICONS[0].value;
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

  render() {
    return html`
      <span class="button" part="button">
        ${this.icon
          ? html`
              <button
                class="icon-picker-trigger"
                type="button"
                title="Choose button icon"
                aria-label="Choose button icon"
                popovertarget="button-icon-picker"
                ?disabled=${this.disabled}
              >
                ${ICONS.find(({ value }) => value === this.icon)?.svg}
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
        <div class="icon-options">
          ${ICONS.map(
            ({ value, label, svg }) => html`
              <button
                type="button"
                title=${label}
                aria-label=${label}
                aria-pressed=${this.icon === value}
                data-icon=${value}
                @click=${this.#changeIcon}
              >
                ${svg}
              </button>
            `,
          )}
        </div>
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
    this.icon = event.currentTarget.dataset.icon;
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
    this.text = event.currentTarget.textContent ?? "";
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
