import { html } from "lit";
import { GroupBase } from "../base/group-base.js";

export class AboutGroup extends GroupBase {
  static defaultJson = {
    blocks: [
      {
        id: "icon",
        type: "icon",
        icon: "plus",
        align: "left",
      },
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
      ${this.renderSortControls()}
      <div data-group-box>
        <icon-block block-id="icon"></icon-block>
        <rich-text-block block-id="title" placeholder="About title"></rich-text-block>
        <rich-text-block block-id="description" placeholder="About description"></rich-text-block>
      </div>
    `;
  }
}

customElements.define("about-group", AboutGroup);
