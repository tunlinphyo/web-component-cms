import { html } from "lit";
import { GroupBase } from "./group-base";

export class HeaderGroup extends GroupBase {
  render() {
    return html`
      ${this.renderSortControls()}
      <image-block block-id="logo" placeholder="Choose header logo"></image-block>
      <rich-text-block block-id="title" placeholder="Site title"></rich-text-block>
    `;
  }
}

customElements.define("header-group", HeaderGroup);
