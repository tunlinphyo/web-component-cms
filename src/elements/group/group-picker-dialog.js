import { LitElement, html } from "lit";
import { groupPickerDialogStyles } from "./group-picker-dialog.styles.js";

const GROUP_TYPES = [
  "header",
  "home-banner",
  "coming-soon",
  "about-hokupay",
  "about",
  "image",
  "paragraph",
  "footer",
];

export class GroupPickerDialog extends LitElement {
  static styles = groupPickerDialogStyles;

  render() {
    return html`
      <dialog @click=${this.#closeFromBackdrop}>
        <menu>
          ${GROUP_TYPES.map(
      (type, index) =>
        html`<button
                type="button"
                ?autofocus=${index === 0}
                @click=${() => this.#select(type)}
              >
                Add ${type}
              </button>`,
    )}
          <button type="button" @click=${this.close}>Cancel</button>
        </menu>
      </dialog>
    `;
  }

  open() {
    this.renderRoot.querySelector("dialog")?.showModal();
  }

  close = () => {
    this.renderRoot.querySelector("dialog")?.close();
  };

  #select(type) {
    this.dispatchEvent(new CustomEvent("group-select", { bubbles: true, detail: { type } }));
    this.close();
  }

  #closeFromBackdrop = (event) => {
    if (event.target === event.currentTarget) this.close();
  };
}

customElements.define("group-picker-dialog", GroupPickerDialog);
