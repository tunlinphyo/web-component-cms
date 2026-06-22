import { html } from "lit";
import { GroupBase } from "./group-base";
import { headerGroupStyles } from "./header-group.style.js";
import "../block-group/header-button-block-group.js";

export class HeaderGroup extends GroupBase {
  static styles = [GroupBase.styles, headerGroupStyles];

  init(data = {}) {
    void this.updateComplete.then(() => {
      const navBlocks = getNavBlocks(data.blocks);
      if (Array.isArray(data.blocks)) {
        this.renderRoot.querySelector("header-button-block-group")?.setBlockData(navBlocks);
      }
      super.init(data);
    });
    return this;
  }

  toJSON() {
    const navGroup = this.renderRoot.querySelector("header-button-block-group");
    const navBlocks = navGroup?.blocks ?? [];
    const navBlockSet = new Set(navBlocks);
    const blocks = this.blocks.filter((block) => !navBlockSet.has(block));

    return {
      id: this.groupId,
      type: this.groupType || this.localName.replace(/-group$/, ""),
      order: this.order,
      backgroundColor: this.backgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderRadius: this.borderRadius,
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
              <button-block block-id="nav-1" placeholder="Nav 1"></button-block>
              <button-block block-id="nav-2" placeholder="Nav 2"></button-block>
              <button-block block-id="nav-3" placeholder="Nav 3"></button-block>
              <button-block block-id="nav-4" placeholder="Nav 4"></button-block>
            </header-button-block-group>
          </nav>
          <button-block block-id="button" placeholder="Hero button"></button-block>
        </div>
      </header>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("header-group", HeaderGroup);

function getNavBlocks(blocks = []) {
  if (!Array.isArray(blocks)) return [];

  const navs = blocks.find((block) => block.type === "navs" || block.id === "navs");
  if (Array.isArray(navs?.children)) {
    return normalizeNavBlocks(navs.children);
  }

  return normalizeNavBlocks(blocks.filter((block) => block.id?.startsWith("nav-")));
}

function normalizeNavBlocks(blocks) {
  return [...blocks]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((block) => ({
      ...block,
      id: block.id?.startsWith("nav-") ? randomHash() : (block.id ?? randomHash()),
    }));
}

function randomHash() {
  const bytes = new Uint8Array(6);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
