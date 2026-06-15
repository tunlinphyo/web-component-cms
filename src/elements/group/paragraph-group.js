import { html } from "lit";
import { GroupBase } from "./group-base";

export class ParagraphGroup extends GroupBase {
  render() {
    return html`
      ${this.renderSortControls()}
      <div data-group-box>
        <rich-text-block block-id="paragraph" type="p" placeholder="Paragraph"></rich-text-block>
      </div>
    `;
  }
}

customElements.define("paragraph-group", ParagraphGroup);
