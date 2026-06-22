import { LitElement, html } from "lit";
import { formatToggleStyles } from "../format/format-toggle.styles.js";

export class BlockGroupFilter extends LitElement {
  static properties = {
    hidden: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
    canAdd: { type: Boolean, attribute: "can-add" },
    canDelete: { type: Boolean, attribute: "can-delete" },
    count: { type: Number },
    min: { type: Number },
    max: { type: Number },
  };

  static styles = formatToggleStyles;

  constructor() {
    super();
    this.hidden = true;
    this.disabled = true;
    this.canAdd = false;
    this.canDelete = false;
    this.count = 0;
    this.min = 0;
    this.max = 0;
  }

  render() {
    return html`
      <button
        type="button"
        title=${`Add nav item (${this.count}/${this.max})`}
        aria-label="Add nav item"
        ?disabled=${this.disabled || !this.canAdd}
        @click=${() => this.#apply("add")}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
      <button
        type="button"
        title=${`Delete nav item (${this.count}/${this.min})`}
        aria-label="Delete nav item"
        ?disabled=${this.disabled || !this.canDelete}
        @click=${() => this.#apply("delete")}
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
    `;
  }

  setFormat(format) {
    this.hidden = !format;
    this.disabled = !format;
    this.canAdd = Boolean(format?.canAdd);
    this.canDelete = Boolean(format?.canDelete);
    this.count = format?.count ?? 0;
    this.min = format?.min ?? 0;
    this.max = format?.max ?? 0;
  }

  #apply(action) {
    this.dispatchEvent(
      new CustomEvent("block-group-command", {
        detail: { action },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("block-group-filter", BlockGroupFilter);
