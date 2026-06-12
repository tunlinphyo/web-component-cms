import { LitElement, html } from "lit";

const BLOCK_SELECTOR = "rich-text-block";
const CONTENT_BLOCK_SELECTOR = "image-block, rich-text-block";
const GROUP_SELECTOR =
  "header-group, hero-group, about-group, image-group, paragraph-group, footer-group";

export class RichTextEditor extends LitElement {
  constructor() {
    super();
    this.activeBlock = null;
  }

  render() {
    return html`<slot></slot>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("selection-format-change", this.#selectionFormatChange);
    this.addEventListener("format-command", this.#formatCommand);
    this.addEventListener("element-type-change", this.#elementTypeChange);
    this.addEventListener("mousedown", this.#mousedown);
  }

  disconnectedCallback() {
    this.removeEventListener("selection-format-change", this.#selectionFormatChange);
    this.removeEventListener("format-command", this.#formatCommand);
    this.removeEventListener("element-type-change", this.#elementTypeChange);
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
    const block = event.composedPath().find((element) => element.matches?.(BLOCK_SELECTOR));
    if (!block) return;

    this.#setActiveBlock(block);
    this.#notifyToolbar(event.detail);
  };

  #formatCommand = (event) => {
    const alignment = event.detail.command
      .match(/^align(Left|Center|Right|Justify)$/)?.[1]
      .toLowerCase();

    if (alignment) {
      if (this.activeBlock?.matches("image-block")) {
        this.activeBlock.align = alignment;
        this.#notifyToolbar(this.activeBlock.getSelectionFormat());
      } else {
        this.activeBlock?.align?.(alignment);
      }
    } else {
      this.activeBlock?.formatSelection?.(event.detail.command, event.detail.value);
    }
  };

  #elementTypeChange = (event) => {
    this.activeBlock?.setType?.(event.detail.type);
  };

  #mousedown = (event) => {
    const block = event.composedPath().find((element) => element.matches?.(CONTENT_BLOCK_SELECTOR));
    if (block) {
      this.#setActiveBlock(block);
      if (block.matches("image-block")) this.#notifyToolbar(block.getSelectionFormat());
    }

    if (!event.composedPath().some((element) => element.localName === "format-toolbar")) return;

    this.activeBlock?.captureSelection?.();
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
    if (block?.matches("image-block")) {
      document.getSelection()?.removeAllRanges();
    }
    this.activeBlock?.removeAttribute("active");
    this.activeBlock = block;
    this.activeBlock?.setAttribute("active", "");
  }
}

customElements.define("rich-text-editor", RichTextEditor);
