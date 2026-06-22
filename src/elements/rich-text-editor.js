import { LitElement, html } from "lit";

const BLOCK_SELECTOR = "rich-text-block";
const CONTENT_BLOCK_SELECTOR = "button-block, icon-block, image-block, rich-text-block";
const BLOCK_GROUP_SELECTOR = "header-button-block-group";
const GROUP_SELECTOR =
  "header-group, home-banner-group, coming-soon-group, about-hokupay-group, hero-group, about-group, image-group, paragraph-group, footer-group";

export class RichTextEditor extends LitElement {
  constructor() {
    super();
    this.activeBlock = null;
    this.activeGroup = null;
    this.activeBlockGroup = null;
  }

  render() {
    return html`<slot></slot>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("selection-format-change", this.#selectionFormatChange);
    this.addEventListener("format-command", this.#formatCommand);
    this.addEventListener("element-type-change", this.#elementTypeChange);
    this.addEventListener("group-style-change", this.#groupStyleChange);
    this.addEventListener("block-group-command", this.#blockGroupCommand);
    this.addEventListener("block-group-change", this.#blockGroupChange);
    this.addEventListener("restore-selection", this.#restoreSelection);
    this.addEventListener("mousedown", this.#mousedown);
  }

  disconnectedCallback() {
    this.removeEventListener("selection-format-change", this.#selectionFormatChange);
    this.removeEventListener("format-command", this.#formatCommand);
    this.removeEventListener("element-type-change", this.#elementTypeChange);
    this.removeEventListener("group-style-change", this.#groupStyleChange);
    this.removeEventListener("block-group-command", this.#blockGroupCommand);
    this.removeEventListener("block-group-change", this.#blockGroupChange);
    this.removeEventListener("restore-selection", this.#restoreSelection);
    this.removeEventListener("mousedown", this.#mousedown);
    super.disconnectedCallback();
  }

  init(pageData = []) {
    this.querySelector("group-order")?.init(pageData);

    const groupsById = new Map(
      [...this.querySelectorAll(GROUP_SELECTOR)].map((group) => [
        group.getAttribute("group-id"),
        group,
      ]),
    );
    const blocksById = new Map(this.#getContentBlocks().map((block) => [block.blockId, block]));

    for (const data of pageData) {
      if (Array.isArray(data.blocks)) {
        groupsById.get(data.id)?.init(data);
      } else {
        blocksById.get(data.id)?.init(data);
      }
    }

    return this;
  }

  toJSON() {
    const groups = [...this.querySelectorAll(GROUP_SELECTOR)].map((group) => group.toJSON());
    const ungroupedBlocks = [...this.querySelectorAll(CONTENT_BLOCK_SELECTOR)].map((block) =>
      block.toJSON(),
    );

    return [...groups, ...ungroupedBlocks];
  }

  #getContentBlocks() {
    const ungroupedBlocks = [...this.querySelectorAll(CONTENT_BLOCK_SELECTOR)];
    const groupedBlocks = [...this.querySelectorAll(GROUP_SELECTOR)].flatMap(
      (group) => group.blocks,
    );

    return [...ungroupedBlocks, ...groupedBlocks];
  }

  #selectionFormatChange = (event) => {
    const group = event.composedPath().find((element) => element.matches?.(GROUP_SELECTOR));
    const blockGroup = event
      .composedPath()
      .find((element) => element.matches?.(BLOCK_GROUP_SELECTOR));
    const block = event.composedPath().find((element) => element.matches?.(BLOCK_SELECTOR));
    if (!block) return;

    if (group) this.#setActiveGroup(group, blockGroup, block);
    this.#setActiveBlock(block);
    this.#notifyToolbar(event.detail);
  };

  #formatCommand = (event) => {
    const alignment = event.detail.command
      .match(/^align(Left|Center|Right|Justify)$/)?.[1]
      .toLowerCase();

    if (alignment) {
      if (this.activeBlock?.matches("button-block, icon-block, image-block")) {
        this.activeBlock.align = alignment;
        this.#notifyToolbar(this.activeBlock.getSelectionFormat());
      } else {
        this.activeBlock?.align?.(alignment);
      }
    } else if (event.detail.command === "fontFamily") {
      this.activeBlock?.setFontFamily?.(event.detail.value);
    } else if (event.detail.command === "borderRadius") {
      if (!this.activeBlock?.setBorderRadius?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "blockStyle") {
      if (!this.activeBlock?.setBlockStyle?.(event.detail.property, event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "buttonDesign") {
      if (!this.activeBlock?.setButtonDesign?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "buttonIconPlacement") {
      if (!this.activeBlock?.setButtonIconPlacement?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "buttonLink") {
      if (!this.activeBlock?.setButtonLink?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "buttonLinkTarget") {
      if (!this.activeBlock?.setButtonLinkTarget?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "imageLink") {
      if (!this.activeBlock?.setImageLink?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "imageLinkTarget") {
      if (!this.activeBlock?.setImageLinkTarget?.(event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (event.detail.command === "disabled") {
      const disabled = !this.activeBlock?.getSelectionFormat?.().disabled;
      if (!this.activeBlock?.setDisabled?.(disabled)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else if (this.activeBlock?.matches("icon-block")) {
      if (!this.activeBlock.formatSelection?.(event.detail.command, event.detail.value)) return;
      this.#notifyToolbar(this.activeBlock.getSelectionFormat());
    } else {
      this.activeBlock?.formatSelection?.(event.detail.command, event.detail.value);
    }
  };

  #elementTypeChange = (event) => {
    this.activeBlock?.setType?.(event.detail.type);
  };

  #groupStyleChange = (event) => {
    if (!this.activeGroup?.setGroupStyle?.(event.detail.property, event.detail.value)) return;
    this.#notifyGroupToolbar(
      this.activeGroup.getGroupFormat(),
      this.activeBlockGroup,
      this.activeBlock,
    );
  };

  #blockGroupCommand = (event) => {
    if (!this.activeBlockGroup) return;
    if (event.detail.action === "sort") {
      if (!this.activeBlockGroup.reorderBlocks?.(event.detail.ids, this.activeBlock)) return;
      this.#notifyGroupToolbar(
        this.activeGroup?.getGroupFormat(),
        this.activeBlockGroup,
        this.activeBlock,
      );
      return;
    }

    const adding = event.detail.action === "add";
    const nextBlock = adding
      ? this.activeBlockGroup.addBlock(this.activeBlock)
      : this.activeBlockGroup.deleteBlock(this.activeBlock);

    if (!nextBlock && adding) return;
    this.#setActiveBlock(nextBlock);
    this.#notifyToolbar(nextBlock?.getSelectionFormat?.() ?? null);
    this.#notifyGroupToolbar(this.activeGroup?.getGroupFormat(), this.activeBlockGroup, nextBlock);
    requestAnimationFrame(() => {
      nextBlock?.renderRoot.querySelector(".text")?.focus({ preventScroll: true });
    });
  };

  #blockGroupChange = (event) => {
    this.activeBlockGroup = event.detail.group;
    if (event.detail.activeBlock) this.#setActiveBlock(event.detail.activeBlock);
    this.#notifyGroupToolbar(
      this.activeGroup?.getGroupFormat(),
      this.activeBlockGroup,
      this.activeBlock,
    );
  };

  #restoreSelection = () => {
    requestAnimationFrame(() => this.activeBlock?.restoreSelection?.());
  };

  #mousedown = (event) => {
    const group = event.composedPath().find((element) => element.matches?.(GROUP_SELECTOR));
    const blockGroup = event
      .composedPath()
      .find((element) => element.matches?.(BLOCK_GROUP_SELECTOR));
    const block = event.composedPath().find((element) => element.matches?.(CONTENT_BLOCK_SELECTOR));
    if (group) this.#setActiveGroup(group, blockGroup, block);
    if (block) {
      this.#setActiveBlock(block);
      if (block.matches("button-block, icon-block, image-block")) {
        this.#notifyToolbar(block.getSelectionFormat());
      }
    }

    if (!event.composedPath().some((element) => element.localName === "format-toolbar")) return;

    this.activeBlock?.captureSelection?.({ preserve: true });
    if (
      event
        .composedPath()
        .some((element) =>
          [
            "format-bold",
            "format-italic",
            "format-underline",
            "format-ordered-list",
            "format-unordered-list",
            "format-align-left",
            "format-align-center",
            "format-align-right",
            "format-align-justify",
            "format-highlight",
          ].includes(element.localName),
        )
    ) {
      event.preventDefault();
    }
  };

  #notifyToolbar(format) {
    this.querySelector("format-toolbar")?.dispatchEvent(
      new CustomEvent("selection-format-change", {
        detail: format,
      }),
    );
  }

  #setActiveBlock(block) {
    if (block === this.activeBlock) return;

    this.activeBlock?.clearSelection?.();
    if (block?.matches("button-block, icon-block, image-block")) {
      document.getSelection()?.removeAllRanges();
    }
    this.activeBlock?.removeAttribute("active");
    this.activeBlock = block;
    this.activeBlock?.setAttribute("active", "");
  }

  #setActiveGroup(group, blockGroup = null, block = null) {
    if (group === this.activeGroup) {
      this.activeBlockGroup = blockGroup;
      this.#notifyGroupToolbar(group.getGroupFormat(), blockGroup, block);
      return;
    }

    this.activeGroup?.removeAttribute("active");
    this.activeGroup = group;
    this.activeBlockGroup = blockGroup;
    this.activeGroup?.setAttribute("active", "");
    this.#notifyGroupToolbar(group.getGroupFormat(), blockGroup, block);
  }

  #notifyGroupToolbar(format, blockGroup = null, block = null) {
    this.querySelector("group-format-toolbar")?.dispatchEvent(
      new CustomEvent("group-format-change", {
        detail: format ? { ...format, blockGroup: blockGroup?.getFormat?.(block) ?? null } : null,
      }),
    );
  }
}

customElements.define("rich-text-editor", RichTextEditor);
