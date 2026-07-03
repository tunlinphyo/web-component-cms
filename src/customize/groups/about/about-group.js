import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";
import { groupStyles } from "./about-group.style.js";
import { decoratedTitleStyles, renderDecoratedTitle } from "../shared/decorated-title.js";

export class AboutGroup extends GroupBase {
  static styles = [GroupBase.styles, decoratedTitleStyles, groupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "h2",
        value: "",
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "description",
        type: "p",
        value: "",
        textAlign: "left",
        fontWeight: "",
      },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        ${renderDecoratedTitle("Title")}
        <!-- <rich-text-block block-id="title" placeholder="About title"></rich-text-block> -->
        <rich-text-block block-id="description" placeholder="About description"></rich-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("about-group", AboutGroup);
