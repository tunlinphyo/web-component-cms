import { LitElement, html } from "lit";
import { listGroupDefinitions } from "../../registries/group-registry.js";
import { groupPickerDialogStyles } from "./group-picker-dialog.styles.js";

export class GroupPickerDialog extends LitElement {
  static styles = groupPickerDialogStyles;

  render() {
    const groups = listGroupDefinitions().filter((definition) => definition.addable !== false);

    return html`
      <dialog @click=${this.#closeFromBackdrop}>
        <menu>
          ${groups.map(
            (definition, index) =>
              html`<button
                type="button"
                ?autofocus=${index === 0}
                @click=${() => this.#select(definition.type)}
              >
                Add ${definition.label ?? definition.type}
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
