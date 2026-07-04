import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import { groupStyles } from "./hero-group.style.js";

export class HeroGroup extends GroupBase {
  static styles = [GroupBase.styles, groupStyles];

  render() {
    return html`
      <div data-group-box>
        <div class="detail">
          <inline-text block-id="title" placeholder="Hero title" type="h1"></inline-text>
          <rich-text-block block-id="description" placeholder="Hero description"></rich-text-block>
          <div class="flex-box">
            <icon-block block-id="icon-1"></icon-block>
            <icon-block block-id="icon-2"></icon-block>
            <icon-block block-id="icon-3"></icon-block>
          </div>
        </div>
        <div class="media">
          <image-block block-id="image"></image-block>
        </div>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

HeroGroup.define("hero-group");
