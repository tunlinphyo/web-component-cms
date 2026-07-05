import { css, html, LitElement } from "lit";
import {
  materialSymbolStyles,
  renderMaterialIcon,
} from "../plugin/components/icon-picker/material-icon-picker.js";

export class JsonDisplay extends LitElement {
  static properties = {
    data: { attribute: false },
  };

  static styles = [
    materialSymbolStyles,
    css`
      dialog {
        width: min(56rem, calc(100vw - 2rem));
        max-height: calc(100vh - 2rem);
        padding: 0;
        border: 1px solid var(--gray-300);
        border-radius: 0.75rem;
        color: inherit;
      }

      dialog::backdrop {
        background: rgb(0 0 0 / 0.35);
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--gray-200);
      }

      h2 {
        margin: 0;
        font-size: 1.125rem;
      }

      .actions {
        display: flex;
        gap: 1.5rem;
      }

      button {
        display: grid;
        width: 1.75rem;
        height: 1.75rem;
        padding: 0;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        place-items: center;
      }

      button:is(:hover, :focus-visible) {
        outline: 2px solid var(--highlight);
      }

      pre {
        max-height: calc(100vh - 8rem);
        margin: 0;
        padding: 1rem;
        overflow: auto;
        overscroll-behavior: none;
        background: var(--gray-50);
        font-size: 0.875rem;
        line-height: 1.5;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
    `,
  ];

  constructor() {
    super();
    this.data = null;
  }

  render() {
    return html`
      <dialog @click=${this.#closeFromBackdrop}>
        <header>
          <h2>Editor data</h2>
          <div class="actions">
            <button type="button" title="Copy JSON" aria-label="Copy JSON" @click=${this.#copyJson}>
              ${renderMaterialIcon("content_copy")}
            </button>
            <button type="button" aria-label="Close" @click=${this.close}>
              ${renderMaterialIcon("close")}
            </button>
          </div>
        </header>
        <pre><code>${JSON.stringify(this.data, null, 2)}</code></pre>
      </dialog>
    `;
  }

  async open(data) {
    this.data = data;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")?.showModal();
  }

  close = () => {
    this.renderRoot.querySelector("dialog")?.close();
  };

  #copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(this.data, null, 2));
    this.dispatchEvent(
      new CustomEvent("json-copy-success", {
        bubbles: true,
        composed: true,
      }),
    );
  };

  #closeFromBackdrop = (event) => {
    if (event.target === event.currentTarget) this.close();
  };
}

customElements.define("json-display", JsonDisplay);
