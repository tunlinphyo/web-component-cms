import { html } from "lit";
import { GroupBase } from "./group-base";

export class ParagraphGroup extends GroupBase {
  render() {
    return html`
      ${this.renderSortControls()}
      <rich-text-block block-id="paragraph" type="p" placeholder="Paragraph"></rich-text-block>
    `;
  }
}

customElements.define("paragraph-group", ParagraphGroup);
