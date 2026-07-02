import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";

export class ParagraphGroup extends GroupBase {
  render() {
    return html`
      <div data-group-box>
        <rich-text-block block-id="paragraph" type="p" placeholder="Paragraph"></rich-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("paragraph-group", ParagraphGroup);
