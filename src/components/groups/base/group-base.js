import { LitElement, html } from "lit";
import { groupBaseStyles } from "./group-base.styles.js";
import { getBlockSelector } from "../../../registries/block-registry.js";

export class GroupBase extends LitElement {
  static properties = {
    groupId: { type: String, attribute: "group-id", reflect: true },
    groupType: { type: String, attribute: "group-type", reflect: true },
    sort: { type: Number, reflect: true },
    backgroundColor: { type: String, attribute: "background-color", reflect: true },
    borderWidth: { type: String, attribute: "border-width", reflect: true },
    borderColor: { type: String, attribute: "border-color", reflect: true },
    borderStyle: { type: String, attribute: "border-style", reflect: true },
    borderRadius: { type: String, attribute: "border-radius", reflect: true },
  };

  static defaultJson = {
    blocks: [],
  };

  constructor() {
    super();
    this.groupId = "";
    this.groupType = "";
    this.sort = 0;
    this.backgroundColor = "";
    this.borderWidth = "";
    this.borderColor = "";
    this.borderStyle = "";
    this.borderRadius = "";
  }

  static styles = groupBaseStyles;

  get blocks() {
    return [...this.renderRoot.querySelectorAll(getBlockSelector())];
  }

  renderSortControls() {
    const groups = this.#getGroups();

    return html`
      <div class="sort-controls" part="sort-controls">
        <button
          type="button"
          aria-label="Move group up"
          title="Move group up"
          ?disabled=${groups[0] === this}
          @click=${() => this.#move(-1)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="m18 15-6-6-6 6" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Move group down"
          title="Move group down"
          ?disabled=${groups.at(-1) === this}
          @click=${() => this.#move(1)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Add group below"
          title="Add group below"
          @click=${this.#requestGroupBelow}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Delete group"
          title="Delete group"
          @click=${this.#requestDelete}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m3 0-1 13H7L6 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    `;
  }

  init({ blocks = [], style = {} } = {}) {
    this.backgroundColor = style.backgroundColor ?? "";
    this.borderWidth = style.borderWidth ?? "";
    this.borderColor = style.borderColor ?? "";
    this.borderStyle = style.borderStyle ?? "";
    this.borderRadius = style.borderRadius ?? "";

    void this.updateComplete.then(() => {
      const blocksById = new Map(this.blocks.map((block) => [block.blockId, block]));

      for (const blockData of blocks) {
        blocksById.get(blockData.id)?.init(blockData);
      }
    });
    return this;
  }

  async focusFirstBlock() {
    await this.updateComplete;

    const firstBlock = this.blocks[0];
    if (!firstBlock) return false;

    await firstBlock.updateComplete;

    const focusTarget = firstBlock.renderRoot.querySelector(".editor, .input:not(:disabled)");
    if (!focusTarget) return false;

    focusTarget.focus();
    return true;
  }

  toJSON() {
    return {
      id: this.groupId,
      type: this.groupType || this.localName.replace(/-group$/, ""),
      sort: this.sort,
      style: this.getGroupFormat(),
      blocks: this.blocks.map((block) => block.toJSON()),
    };
  }

  setGroupStyle(property, value) {
    if (
      !["backgroundColor", "borderWidth", "borderColor", "borderStyle", "borderRadius"].includes(
        property,
      )
    ) {
      return false;
    }

    this[property] = value;
    if (property === "borderColor" && !value) {
      this.borderWidth = "";
      this.borderStyle = "";
    }
    if (property === "borderWidth" && value && !this.borderStyle) this.borderStyle = "solid";
    if (property === "borderStyle" && value && value !== "none" && !this.borderWidth) {
      this.borderWidth = "1px";
    }
    this.#dispatchFormat();
    return true;
  }

  getGroupFormat() {
    return {
      backgroundColor: this.backgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderRadius: this.borderRadius,
    };
  }

  #move(offset) {
    const groups = this.#getGroups();
    const index = groups.indexOf(this);
    const adjacentGroup = groups[index + offset];
    if (!adjacentGroup) return;

    const sort = this.sort;
    this.sort = adjacentGroup.sort;
    adjacentGroup.sort = sort;

    groups.forEach((group) => group.requestUpdate());
    this.#dispatchChange();
  }

  #requestGroupBelow = () => {
    this.dispatchEvent(
      new CustomEvent("add-group-request", {
        bubbles: true,
        detail: { after: this },
      }),
    );
  };

  #requestDelete = () => {
    this.dispatchEvent(
      new CustomEvent("delete-group-request", {
        bubbles: true,
        detail: { group: this },
      }),
    );
  };

  #getGroups() {
    return [...(this.parentElement?.children ?? [])]
      .filter((element) => element instanceof GroupBase)
      .sort((a, b) => a.sort - b.sort);
  }

  updated(changedProperties) {
    if (changedProperties.has("sort")) {
      this.style.order = this.sort;
    }
    const groupBox = this.renderRoot.querySelector("[data-group-box]");
    if (!groupBox) return;

    if (changedProperties.has("backgroundColor")) {
      groupBox.style.backgroundColor = this.backgroundColor;
    }
    if (changedProperties.has("borderWidth")) {
      groupBox.style.borderWidth = this.borderWidth;
    }
    if (changedProperties.has("borderColor")) {
      groupBox.style.borderColor = this.borderColor;
    }
    if (changedProperties.has("borderStyle")) {
      groupBox.style.borderStyle = this.borderStyle;
    }
    if (changedProperties.has("borderRadius")) {
      groupBox.style.borderRadius = this.borderRadius;
    }
  }

  #dispatchFormat() {
    this.dispatchEvent(
      new CustomEvent("group-format-change", {
        detail: this.getGroupFormat(),
        bubbles: true,
        composed: true,
      }),
    );
  }

  #dispatchChange() {
    this.dispatchEvent(
      new CustomEvent("editor-change", {
        bubbles: true,
        composed: true,
      }),
    );
  }
}
