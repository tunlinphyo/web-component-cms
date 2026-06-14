import { LitElement, css, html } from "lit";

const GROUP_TYPES = ["header", "hero", "about", "image", "paragraph", "footer"];

export class GroupPickerDialog extends LitElement {
  static styles = css`
    dialog {
      border: 1px solid #999;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    menu {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
    }
  `;

  render() {
    return html`
      <dialog @click=${this.#closeFromBackdrop}>
        <menu>
          ${GROUP_TYPES.map(
            (type, index) =>
              html`<button type="button" ?autofocus=${index === 0} @click=${() => this.#select(type)}>Add ${type}</button>`,
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
