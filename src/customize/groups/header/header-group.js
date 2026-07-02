import { html } from "lit";
import { GroupBase } from "../../../components/groups/base/group-base.js";
import { headerGroupStyles } from "./header-group.style.js";
import "../../../components/lists/header-nav/header-nav-list.js";
import { getListDefinition } from "../../../registries/list-registry.js";

const HEADER_NAV_SELECTOR =
  getListDefinition("header-nav")?.selector ?? "header-button-block-group";

export class HeaderGroup extends GroupBase {
  static styles = [GroupBase.styles, headerGroupStyles];

  init(data = {}) {
    void this.updateComplete.then(() => {
      const navBlocks = getNavBlocks(data.blocks);
      if (Array.isArray(data.blocks)) {
        this.renderRoot.querySelector(HEADER_NAV_SELECTOR)?.setBlockData(navBlocks);
      }
      super.init(data);
    });
    return this;
  }

  toJSON() {
    const navGroup = this.renderRoot.querySelector(HEADER_NAV_SELECTOR);
    const navBlocks = navGroup?.blocks ?? [];
    const navBlockSet = new Set(navBlocks);
    const blocks = this.blocks.filter((block) => !navBlockSet.has(block));

    return {
      id: this.groupId,
      type: this.groupType || this.localName.replace(/-group$/, ""),
      hashId: this.hashId,
      sort: this.sort,
      style: this.getGroupStyle(),
      blocks: [
        ...blocks.slice(0, 2).map((block) => block.toJSON()),
        {
          id: "navs",
          type: "navs",
          children: navBlocks.map((block, sort) => ({
            ...block.toJSON(),
            sort,
          })),
        },
        ...blocks.slice(2).map((block) => block.toJSON()),
      ],
    };
  }

  render() {
    return html`
      <header data-group-box>
        <rich-text-block
          block-id="title"
          placeholder="Title"
          predefined-margin="0"
        ></rich-text-block>
        <div class="container">
          <image-block block-id="logo" placeholder="Choose Logo"></image-block>
          <nav>
            <header-button-block-group
              min="0"
              max="6"
              prefix="nav"
              placeholder="Nav"
              default-design="nav"
            >
              <button-block placeholder="Nav 1"></button-block>
              <button-block placeholder="Nav 2"></button-block>
              <button-block placeholder="Nav 3"></button-block>
              <button-block placeholder="Nav 4"></button-block>
            </header-button-block-group>
          </nav>
          <button-block block-id="button" placeholder="Hero button"></button-block>
        </div>
      </header>
      <!-- ${this.renderSortControls()} -->
    `;
  }
}

customElements.define("header-group", HeaderGroup);

function getNavBlocks(blocks = []) {
  if (!Array.isArray(blocks)) return [];

  const navs = blocks.find((block) => block.type === "navs");
  if (!Array.isArray(navs?.children)) return [];
  return [...navs.children].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
}
