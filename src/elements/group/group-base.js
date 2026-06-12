import { LitElement, css, html } from "lit";

export class GroupBase extends LitElement {
  static properties = {
    groupId: { type: String, attribute: "group-id", reflect: true },
    groupType: { type: String, attribute: "group-type", reflect: true },
    order: { type: Number, reflect: true },
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
    }
  `;

  get blocks() {
    return [...this.renderRoot.querySelectorAll("image-block, rich-text-block")];
  }

  renderSortControls() {
    const groups = this.#getGroups();

    return html`
      <div class="sort-controls" part="sort-controls">
        <button type="button" ?disabled=${groups[0] === this} @click=${() => this.#move(-1)}>
          Move group up
        </button>
        <button type="button" ?disabled=${groups.at(-1) === this} @click=${() => this.#move(1)}>
          Move group down
        </button>
        <button type="button" @click=${this.#requestGroupBelow}>Add group below</button>
        <button type="button" @click=${this.#requestDelete}>Delete group</button>
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
