import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";

export class QuillTestGroup extends GroupBase {
  render() {
    return html`
      <div data-group-box>
        <quill-text-block block-id="title" type="h2" placeholder="Quill title"></quill-text-block>
        <quill-text-block
          block-id="paragraph"
          type="p"
          placeholder="Quill paragraph"
        ></quill-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("quill-test-group", QuillTestGroup);
