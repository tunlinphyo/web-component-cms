import { LitElement, css, html } from "lit";
import { formatToggleStyles } from "./format-toggle.styles.js";
import "./sort-list-control.js";

export class BlockGroupFilter extends LitElement {
  static properties = {
    hidden: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
    canAdd: { type: Boolean, attribute: "can-add" },
    canDelete: { type: Boolean, attribute: "can-delete" },
    count: { type: Number },
    min: { type: Number },
    max: { type: Number },
    styleAction: { type: String, attribute: "style-action" },
  };

  static styles = [
    formatToggleStyles,
    css`
      :host {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.25rem;
      }
    `,
  ];

  constructor() {
    super();
    this.hidden = true;
    this.disabled = true;
    this.canAdd = false;
    this.canDelete = false;
    this.count = 0;
    this.min = 0;
    this.max = 0;
    this.styleAction = "";
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
      <block-group-sort></block-group-sort>
      <button
        type="button"
        title=${this.styleAction === "paste" ? "Paste styles" : "Copy styles"}
        aria-label=${this.styleAction === "paste" ? "Paste styles" : "Copy styles"}
        ?disabled=${this.disabled || !this.styleAction}
        @click=${() => this.#apply(`${this.styleAction}-styles`)}
      >
        ${this.styleAction === "paste"
          ? html`
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M9 5h6m-5-2h4l1 2h3v16H6V5h3l1-2Zm0 8h6m-6 4h6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            `
          : html`
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M8 8h11v13H8V8Zm-3 8H3V3h11v2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            `}
      </button>
    `;
  }

  updated() {
    this.renderRoot.querySelector("block-group-sort")?.setFormat(this.#format);
  }

  setFormat(format) {
    this.#format = format;
    this.renderRoot.querySelector("block-group-sort")?.setFormat(format);
    this.hidden = !format;
    this.disabled = !format;
    this.canAdd = Boolean(format?.canAdd);
    this.canDelete = Boolean(format?.canDelete);
    this.count = format?.count ?? 0;
    this.min = format?.min ?? 0;
    this.max = format?.max ?? 0;
    this.styleAction = format?.styleAction ?? "";
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

  #format = null;
}

customElements.define("block-group-filter", BlockGroupFilter);
