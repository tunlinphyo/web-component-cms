import { html } from "lit";
import { GroupBase } from "../../../components/groups/base/group-base.js";
import { hostGroupStyles } from "./news-group.style.js";

export class NewsGroup extends GroupBase {
  static styles = [GroupBase.styles, hostGroupStyles];

  static defaultJson = {
    style: {
      backgroundColor: null,
      borderColor: "#F2ADC0",
      borderStyle: "solid",
      borderRadius: "16px",
      borderPosition: null,
      borderWidth: "1px",
    },
    blocks: [
      {
        id: "date",
        fontFamily: "var(--font-shiokaze)",
        textAlign: "left",
        type: "h2",
        value: "",
        fontWeight: "normal",
        fontSize: "24px",
      },
      {
        id: "title",
        type: "h2",
        value: "",
        textAlign: "left",
        fontFamily: "var(--font-body)",
        fontSize: "20px",
      },
      {
        id: "description",
        type: "p",
        value: "",
        textAlign: "left",
      },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        <rich-text-block
          block-id="date"
          type="p"
          placeholder="News date"
          features="type,fontFamily,fontSize,color,bold,italic,underline"
        >
        </rich-text-block>
        <div class="news-detail">
          <rich-text-block block-id="title" type="h2" placeholder="News title"></rich-text-block>
          <rich-text-block
            block-id="description"
            type="p"
            placeholder="News description"
          ></rich-text-block>
        </div>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("news-group", NewsGroup);
