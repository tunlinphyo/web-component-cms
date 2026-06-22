import { BlockListGroup } from "./block-list-group.js";

export class HeaderButtonBlockGroup extends BlockListGroup {
  connectedCallback() {
    super.connectedCallback();
    this.#normalizeLegacyIds();
  }

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

  #normalizeLegacyIds() {
    for (const block of this.blocks) {
      if (block.blockId?.startsWith("nav-")) block.blockId = this.createId();
    }
  }
}

customElements.define("header-button-block-group", HeaderButtonBlockGroup);
