import { html } from "lit";
import { GroupBase } from "./group-base";

export class AboutGroup extends GroupBase {
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
      ${this.renderSortControls()}
      <rich-text-block block-id="title" placeholder="About title"></rich-text-block>
      <rich-text-block block-id="description" placeholder="About description"></rich-text-block>
    `;
  }
}

customElements.define("about-group", AboutGroup);
