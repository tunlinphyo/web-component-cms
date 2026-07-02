import { html } from "lit";
import { GroupBase } from "../../../components/groups/base/group-base.js";

export class HeroGroup extends GroupBase {
  render() {
    return html`
      <div data-group-box>
        <image-block block-id="image"></image-block>
        <rich-text-block block-id="title" placeholder="Hero title"></rich-text-block>
        <rich-text-block block-id="description" placeholder="Hero description"></rich-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("hero-group", HeroGroup);
