import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import "./partner-nav-button-list-group.js";
import { PartnerNavButtonGroup } from "./partner-nav-button-group.js";
import { partnerHeaderGroupStyles } from "./partner-header-group.style.js";
import { emptyText } from "../shared/text-defaults.js";

const createDefaultNav = (id) => ({
  ...PartnerNavButtonGroup.defaultJson,
  id,
  type: "partner-nav-button",
  link: "",
  target: "_self",
  disabled: false,
  blocks: PartnerNavButtonGroup.defaultJson.blocks.map((block) => ({ ...block })),
});

export class PartnerHeaderGroup extends GroupBase {
  static styles = [GroupBase.styles, partnerHeaderGroupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "inline-text",
        elementType: "p",
        ...emptyText,
        textAlign: "left",
      },
      {
        id: "logo",
        type: "image",
        src: "",
        alt: "",
      },
      {
        id: "navs",
        type: "partner-navs",
        children: [
          createDefaultNav("partner-nav-1"),
          createDefaultNav("partner-nav-2"),
          createDefaultNav("partner-nav-3"),
          createDefaultNav("partner-nav-4"),
        ],
      },
      {
        id: "button",
        type: "button",
        text: "",
        backgroundColor: "var(--green-600)",
      },
    ],
  };

  render() {
    return html`
      <header data-group-box>
        <inline-text block-id="title" placeholder="Title" predefined-margin="0"></inline-text>
        <div class="container">
          <image-block block-id="logo" placeholder="Choose Logo"></image-block>
          <partner-nav-button-list
            block-id="navs"
            block-type="partner-navs"
            min="0"
            max="6"
            prefix="partner-nav"
            placeholder="Nav"
            item-label="nav item"
            sort-label-block="label"
          >
            <partner-nav-button></partner-nav-button>
            <partner-nav-button></partner-nav-button>
            <partner-nav-button></partner-nav-button>
            <partner-nav-button></partner-nav-button>
          </partner-nav-button-list>
          <button-block block-id="button" placeholder="Hero button"></button-block>
        </div>
      </header>
      ${this.renderSortControls()}
    `;
  }
}

PartnerHeaderGroup.define("partner-header-group", {
  type: "partner-header",
  label: "Partner Header",
});
