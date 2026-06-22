import { LitElement, html } from "lit";
import { formatLinkStyles } from "./format-link.styles.js";

export class FormatImageLink extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
    value: { type: String },
  };

  static styles = formatLinkStyles;

  constructor() {
    super();
    this.applied = false;
    this.disabled = true;
    this.value = "";
  }

  render() {
    return html`
      <button
        type="button"
        title=${this.applied ? "Edit image link" : "Add image link"}
        aria-label=${this.applied ? "Edit image link" : "Add image link"}
        popovertarget="image-link-editor"
        ?disabled=${this.disabled}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
          <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
        </svg>
      </button>
      <div id="image-link-editor" popover>
        <form @submit=${this.#save}>
          <input
            type="text"
            inputmode="url"
            placeholder="/page or https://example.com"
            pattern="(/.*|https?://.+)"
            .value=${this.value}
            required
          />
          <button type="submit" title="Save" aria-label="Save">&#10003;</button>
          <button type="button" title="Remove link" aria-label="Remove link" @click=${this.#remove}>
            &#10005;
          </button>
        </form>
      </div>
    `;
  }

  #save = (event) => {
    event.preventDefault();
    const value = this.renderRoot.querySelector("input").value.trim();
    if (!value) return;

    this.#dispatch(value);
    this.#close();
  };

  #remove = () => {
    this.#dispatch("");
    this.#close();
  };

  #dispatch(value) {
    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "imageLink", value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #close() {
    this.renderRoot.querySelector("[popover]")?.hidePopover();
  }
}

customElements.define("format-image-link", FormatImageLink);
