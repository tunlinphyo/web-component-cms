import { LitElement, css, html } from "lit";

export class FormatLink extends LitElement {
  static properties = {
    applied: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    value: { type: String },
  };

  static styles = css`
    :host {
      display: grid;
      gap: 4px;
    }

    button,
    input {
      box-sizing: border-box;
      height: 32px;
    }

    button {
      background: white;
      border: 1px solid #aaa;
      border-radius: 4px;
      cursor: pointer;
    }

    :host([applied]) > button {
      background: var(--highlight);
      color: white;
    }

    form {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4px;
    }
  `;

  constructor() {
    super();
    this.applied = false;
    this.disabled = false;
    this.open = false;
    this.value = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("focusout", this.#focusout);
    document.addEventListener("pointerdown", this.#pointerdown, true);
  }

  disconnectedCallback() {
    this.removeEventListener("focusout", this.#focusout);
    document.removeEventListener("pointerdown", this.#pointerdown, true);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has("applied") && this.applied) this.open = true;
  }

  #toggle() {
    if (this.applied) {
      this.#dispatchLink();
      this.open = false;
      return;
    }

    this.open = !this.open;
    this.open ? this.#dispatchLinkEdit() : this.#dispatchLinkCancel();
  }

  #save(event) {
    event.preventDefault();
    const value = this.renderRoot.querySelector("input").value.trim();
    if (!value) return;

    this.value = value;
    this.#dispatchLink(value);
  }

  #focusout = () => {
    queueMicrotask(() => {
      if (!this.open || this.matches(":focus-within")) return;

      this.#cancel();
    });
  };

  #pointerdown = (event) => {
    if (!this.open || event.composedPath().includes(this)) return;
    this.#cancel();
  };

  #cancel() {
    this.open = false;
    this.#dispatchLinkCancel();
  }

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
        title=${this.applied ? "Remove link" : "Add link"}
        ?disabled=${this.disabled}
        @mousedown=${(event) => event.preventDefault()}
        @click=${this.#toggle}
      >
        Link
      </button>
      ${this.open
        ? html`<form @mousedown=${(event) => event.stopPropagation()} @submit=${this.#save}>
            <input type="url" placeholder="https://example.com" .value=${this.value} required />
            <button type="submit" title="Save" aria-label="Save">&#10003;</button>
          </form>`
        : null}
    `;
  }
}

customElements.define("format-link", FormatLink);
