import { html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { GroupPickerBase } from "../../components/group-pickers/base/group-picker-base.js";
import "../layout-designs/index.js";
import { listGroupDefinitions } from "../../registries/group-registry.js";
import { groupPickerDialogStyles } from "./group-picker-dialog.styles.js";

export class GroupPickerDialog extends GroupPickerBase {
  static styles = groupPickerDialogStyles;

  get groups() {
    return listGroupDefinitions().filter(
      (definition) => definition.addable !== false && matchesPicker(definition, this.picker),
    );
  }

  render() {
    return html`
      <dialog @click=${this.closeFromBackdrop}>
        <form @submit=${this.submitSelection}>
          <header>
            <h2>Add Section</h2>
          </header>
          <fieldset>
            <!-- <legend>Select a Section</legend> -->
            ${this.groups.map(
              (definition, index) => html`
                <label class="group-option">
                  <input
                    type="radio"
                    name="groupType"
                    value=${definition.type}
                    ?autofocus=${index === 0}
                    .checked=${this.selectedType === definition.type}
                    @change=${this.selectGroup}
                  />
                  <span class="option-name">${definition.label ?? definition.type}</span>
                  ${renderLayoutDesign(definition.type)}
                </label>
              `,
            )}
          </fieldset>
          <footer>
            <button type="button" @click=${this.close}>Close</button>
            <button class="add" type="submit" ?disabled=${!this.selectedType}>Add</button>
          </footer>
        </form>
      </dialog>
    `;
  }
}

customElements.define("group-picker-dialog", GroupPickerDialog);

const DEFAULT_PICKER = "content";

function matchesPicker(definition, picker) {
  if (!picker) return true;

  const pickers = Array.isArray(definition.picker)
    ? definition.picker
    : [definition.picker ?? DEFAULT_PICKER];
  return pickers.includes(picker);
}

function renderLayoutDesign(type) {
  const tagName = unsafeStatic(`layout-${type}`);
  return staticHtml`<${tagName}></${tagName}>`;
}
