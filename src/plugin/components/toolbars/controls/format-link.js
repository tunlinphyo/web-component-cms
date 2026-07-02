import { html } from "lit";
import { PopoverControl } from "./popover-control.js";
import { formatLinkStyles } from "./format-link.styles.js";

export class FormatLink extends PopoverControl {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
    open: { type: Boolean, reflect: true },
    value: { type: String },
  };

  static styles = formatLinkStyles;

  constructor() {
    super();
    this.applied = false;
    this.disabled = false;
    this.open = false;
    this.value = "";
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (!changedProperties.has("open")) return;

    const popover = this.popover;
    if (!popover) return;
    if (this.open && !popover.matches(":popover-open")) popover.showPopover();
    if (!this.open) this.closePopover();
  }

  #toggle = () => {
    if (this.open) {
      this.open = false;
      this.#dispatchLinkCancel();
    } else {
      this.open = true;
      this.#dispatchLinkEdit();
    }
  };

  #save = (event) => {
    event.preventDefault();
    const value = this.renderRoot.querySelector("input").value.trim();
    if (!value) return;

    this.value = value;
    this.#dispatchLink(value);
    this.#close();
  };

  #remove = () => {
    this.#dispatchLink();
    this.#close();
  };

  #close() {
    this.open = false;
  }

  #togglePopover = (event) => {
    if (event.newState !== "closed" || !this.open) return;

    this.open = false;
    this.#dispatchLinkCancel();
  };

  #dispatchLink(value = null) {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "link", value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #dispatchLinkEdit() {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "linkEdit" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #dispatchLinkCancel() {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "linkCancel" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        type="button"
        title=${this.applied ? "Edit link" : "Add link"}
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
        @click=${this.#toggle}
        aria-label=${this.applied ? "Edit link" : "Add link"}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
          <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
        </svg>
      </button>
      <div popover @toggle=${this.#togglePopover}>
        <form @mousedown=${(event) => event.stopPropagation()} @submit=${this.#save}>
          <input type="url" placeholder="https://example.com" .value=${this.value} required />
          <button class="btn-save" type="submit" title="Save" aria-label="Save">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
          <button
            class="btn-remove"
            type="button"
            title="Remove link"
            aria-label="Remove link"
            @click=${this.#remove}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6 18 20H6L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </svg>
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define("format-link", FormatLink);
