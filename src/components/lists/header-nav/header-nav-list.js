import { BlockListGroup } from "../block-list/block-list-group.js";

export class HeaderButtonBlockGroup extends BlockListGroup {
  get prefix() {
    return this.getAttribute("prefix") || "nav";
  }

  get placeholder() {
    return this.getAttribute("placeholder") || "Nav";
  }

  get itemLabel() {
    return this.getAttribute("item-label") || "Nav item";
  }

  get defaultDesign() {
    return this.getAttribute("default-design") || "nav";
  }
}

customElements.define("header-button-block-group", HeaderButtonBlockGroup);
