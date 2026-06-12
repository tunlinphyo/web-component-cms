import { html } from "lit";
import { GroupBase } from "./group-base";

export class HeroGroup extends GroupBase {
  render() {
    return html`
      ${this.renderSortControls()}
      <image-block block-id="image"></image-block>
      <rich-text-block block-id="title" placeholder="Hero title"></rich-text-block>
      <rich-text-block block-id="description" placeholder="Hero description"></rich-text-block>
    `;
  }
}

customElements.define("hero-group", HeroGroup);
