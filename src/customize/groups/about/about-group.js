import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import { groupStyles } from "./about-group.style.js";
import { decoratedTitleStyles, renderDecoratedTitle } from "../shared/decorated-title.js";
import { emptyText } from "../shared/text-defaults.js";

export class AboutGroup extends GroupBase {
  static styles = [GroupBase.styles, decoratedTitleStyles, groupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "inline-text",
        elementType: "h2",
        ...emptyText,
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "description",
        type: "p",
        ...emptyText,
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

AboutGroup.define("about-group");
