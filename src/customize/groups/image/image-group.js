import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";

export class ImageGroup extends GroupBase {
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
