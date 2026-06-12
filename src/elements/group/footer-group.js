import { html } from "lit";
import { GroupBase } from "./group-base";

export class FooterGroup extends GroupBase {
  render() {
    return html`
      ${this.renderSortControls()}
      <rich-text-block block-id="copyright" placeholder="Footer copyright"></rich-text-block>
    `;
  }
}

customElements.define("footer-group", FooterGroup);
