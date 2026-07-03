import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";
import { groupStyles } from "./image-group.style.js";

export class ImageGroup extends GroupBase {
  static styles = [GroupBase.styles, groupStyles];

  render() {
    return html`
      <div data-group-box>
        <image-block block-id="image" placeholder="Choose image"></image-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("image-group", ImageGroup);
