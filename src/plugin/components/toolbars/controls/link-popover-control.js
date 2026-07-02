import { html } from "lit";
import { PopoverControl } from "./popover-control.js";

export class LinkPopoverControl extends PopoverControl {
  static properties = {
    applied: { type: Boolean, reflect: true },
    value: { type: String },
  };

  static command = "";
  static subject = "";

  constructor() {
    super();
    this.applied = false;
    this.value = "";
  }

  render() {
    const { subject } = this.constructor;
    const title = this.applied ? `Edit ${subject} link` : `Add ${subject} link`;

    return html`
      <button
        type="button"
        title=${title}
        aria-label=${title}
        popovertarget="link-editor"
        ?disabled=${this.disabled}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
          <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
        </svg>
      </button>
      <div id="link-editor" popover @toggle=${this.handlePopoverToggle}>
        <form @submit=${this.handleSave}>
          <input
            type="text"
            inputmode="url"
            placeholder="/page or https://example.com"
            pattern="(/.*|https?://.+)"
            .value=${this.value}
            required
          />
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
            @click=${this.handleRemove}
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

  handleSave = (event) => {
    event.preventDefault();
    const value = this.renderRoot.querySelector("input").value.trim();
    if (!value) return;

    this.dispatchValue(value);
    this.closePopover();
  };

  handleRemove = () => {
    this.dispatchValue("");
    this.closePopover();
  };

  dispatchValue(value) {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: this.constructor.command, value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
