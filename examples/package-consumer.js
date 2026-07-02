import { html } from "lit";
import {
  GroupBase,
  GroupListBase,
  GroupPickerBase,
  registerGroup,
  registerList,
} from "../src/public-api.js";

export class ExampleGroup extends GroupBase {
  static defaultJson = {
    blocks: [{ id: "content", type: "p", value: "" }],
  };

  render() {
    return html`
      <div data-group-box>
        <rich-text-block block-id="content"></rich-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

export class ExampleGroupList extends GroupListBase {
  static itemTag = "example-group";
  static itemType = "example";
  static itemClass = ExampleGroup;
  static defaultMin = 0;
  static defaultMax = 4;
}

export class ExampleGroupPicker extends GroupPickerBase {
  render() {
    return html`
      <dialog>
        <form @submit=${this.submitSelection}>
          <label>
            <input name="groupType" type="radio" value="example" @change=${this.selectGroup} />
            Example
          </label>
          <button type="submit">Add</button>
        </form>
      </dialog>
    `;
  }
}

customElements.define("example-group", ExampleGroup);
customElements.define("example-group-list", ExampleGroupList);
customElements.define("example-group-picker", ExampleGroupPicker);

registerGroup({
  type: "example",
  tagName: "example-group",
  selector: "example-group",
  label: "Example",
});

registerList({
  type: "example-list",
  tagName: "example-group-list",
  selector: "example-group-list",
});
