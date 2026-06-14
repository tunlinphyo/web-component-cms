import { LitElement, css, html } from "lit";

export class GroupBase extends LitElement {
  static properties = {
    groupId: { type: String, attribute: "group-id", reflect: true },
    groupType: { type: String, attribute: "group-type", reflect: true },
    order: { type: Number, reflect: true },
  };

  static defaultJson = {
    blocks: [],
  };

  constructor() {
    super();
    this.groupId = "";
    this.groupType = "";
    this.order = 0;
  }

  static styles = css`
    .sort-controls {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
      /* opacity: 0;
      pointer-events: none; */
    }

    button {
      width: 2.5rem;
      height: 2.5rem;
      display: grid;
      place-content: center;
      border-radius: 50%;
      border: none;
      cursor: pointer;
    }

    button:not(:disabled):is(:hover,:focus-visible) {
      outline: 2px solid var(--highlight);
      outline-offset: 0;
    }

    /* :host(:hover) .sort-controls,
    :host(:focus-within) .sort-controls {
      opacity: 1;
      pointer-events: auto;
    } */
  `;

  get blocks() {
    return [...this.renderRoot.querySelectorAll("image-block, rich-text-block")];
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

  init({ blocks = [] } = {}) {
    void this.updateComplete.then(() => {
      const blocksById = new Map(this.blocks.map((block) => [block.blockId, block]));

      for (const blockData of blocks) {
        blocksById.get(blockData.id)?.init(blockData);
      }
    });
    return this;
  }

  focusFirstBlock() {
    void this.updateComplete.then(() => {
      const firstBlock = this.blocks[0];
      if (!firstBlock) return;

      // For rich-text-block, focus the editor and position cursor
      const editor = firstBlock.renderRoot?.querySelector(".editor");
      if (editor) {
        editor.focus();
        // Position cursor at the end of the first <p> tag if it exists
        const p = editor.querySelector("p");
        if (p) {
          const range = document.createRange();
          range.setStart(p, 0);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
        return;
      }

      // For image-block, focus the file input
      const fileInput = firstBlock.renderRoot?.querySelector(".input");
      if (fileInput && !fileInput.disabled) {
        fileInput.focus();
      }
    });
  }

  toJSON() {
    return {
      id: this.groupId,
      type: this.groupType || this.localName.replace(/-group$/, ""),
      order: this.order,
      blocks: this.blocks.map((block) => block.toJSON()),
    };
  }

  #move(offset) {
    const groups = this.#getGroups();
    const index = groups.indexOf(this);
    const adjacentGroup = groups[index + offset];
    if (!adjacentGroup) return;

    const order = this.order;
    this.order = adjacentGroup.order;
    adjacentGroup.order = order;

    groups.forEach((group) => group.requestUpdate());
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
      .sort((a, b) => a.order - b.order);
  }

  updated(changedProperties) {
    if (changedProperties.has("order")) {
      this.style.order = this.order;
    }
  }
}
