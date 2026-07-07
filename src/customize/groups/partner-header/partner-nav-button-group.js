import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import { emptyText } from "../shared/text-defaults.js";
import { partnerNavButtonStyles } from "./partner-nav-button-group.style.js";

export class PartnerNavButtonGroup extends GroupBase {
  static properties = {
    link: { type: String },
    target: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = [GroupBase.styles, partnerNavButtonStyles];

  static features = ["link", "linkTarget", "disabled", "borderRadius", "blockGroup"];

  static defaultJson = {
    link: "",
    target: "_self",
    disabled: false,
    style: {
      borderRadius: "var(--border-radius-xxl)",
    },
    blocks: [
      {
        id: "icon",
        type: "icon",
        icon: "home",
        color: "var(--white)",
        backgroundColor: "var(--green-600)",
        borderRadius: "999px",
        fontSize: "1rem",
      },
      {
        id: "label",
        type: "inline-text",
        elementType: "p",
        ...emptyText,
        textAlign: "left",
      },
    ],
  };

  constructor() {
    super();
    this.link = "";
    this.target = "_self";
    this.disabled = false;
  }

  init(options = {}) {
    super.init(options);
    this.link = options.link ?? "";
    this.target = options.target || "_self";
    this.disabled = Boolean(options.disabled);
    return this;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      link: this.link,
      target: this.link ? this.target : "_self",
      disabled: this.disabled,
    };
  }

  getGroupFormat() {
    return {
      ...super.getGroupFormat(),
      link: this.link,
      target: this.target,
      disabled: this.disabled,
    };
  }

  setGroupLink(link) {
    this.link = link ?? "";
    if (!this.link) this.target = "_self";
    return true;
  }

  setGroupLinkTarget(target) {
    if (!["_self", "_blank"].includes(target)) return false;
    this.target = target;
    return true;
  }

  setGroupDisabled(disabled) {
    this.disabled = Boolean(disabled);
    return true;
  }

  render() {
    const content = html`
      <icon-block block-id="icon" ?disabled=${this.disabled}></icon-block>
      <inline-text block-id="label" placeholder="Nav" ?disabled=${this.disabled}></inline-text>
    `;

    return html`
      ${this.link && !this.disabled
        ? html`
            <a
              class="button-group-item"
              data-group-box
              part="button"
              href=${this.link}
              target=${this.target}
              @click=${this.#preventNavigation}
            >
              ${content}
            </a>
          `
        : html`<span class="button-group-item" data-group-box part="button">${content}</span>`}
      ${this.renderSortControls()}
    `;
  }

  #preventNavigation = (event) => {
    event.preventDefault();
  };
}

PartnerNavButtonGroup.define("partner-nav-button", { addable: false });
