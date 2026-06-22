import { html } from "lit";
import { GroupBase } from "../base/group-base.js";

export class ImageGroup extends GroupBase {
  render() {
    return html`
      ${this.renderSortControls()}
      <div data-group-box>
        <image-block block-id="image" placeholder="Choose image"></image-block>
      </div>
    `;
  }
}

customElements.define("image-group", ImageGroup);
