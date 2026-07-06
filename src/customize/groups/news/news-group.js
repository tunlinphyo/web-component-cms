import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import { emptyText } from "../shared/text-defaults.js";
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
        type: "inline-text",
        elementType: "h2",
        ...emptyText,
        fontWeight: "normal",
        fontSize: "24px",
      },
      {
        id: "title",
        type: "inline-text",
        elementType: "h2",
        ...emptyText,
        textAlign: "left",
        fontFamily: "var(--font-body)",
        fontSize: "20px",
      },
      {
        id: "description",
        type: "p",
        ...emptyText,
        textAlign: "left",
      },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        <inline-text block-id="date" type="h2" placeholder="News date"> </inline-text>
        <div class="news-detail">
          <inline-text block-id="title" type="h2" placeholder="News title"></inline-text>
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

NewsGroup.define("news-group", { addable: false });
