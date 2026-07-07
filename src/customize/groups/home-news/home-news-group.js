import { html } from "lit";
import "./news-list-group.js";
import { NewsGroup } from "./news-group.js";
import { GroupBase } from "@/ui-editor";
import { decoratedTitleStyles, renderDecoratedTitle } from "../shared/decorated-title.js";
import { emptyText } from "../shared/text-defaults.js";
import { hostGroupStyles } from "./home-news-group.style.js";

const createDefaultNewsItem = (id) => ({
  ...NewsGroup.defaultJson,
  id,
  type: "news",
  style: { ...NewsGroup.defaultJson.style },
  blocks: NewsGroup.defaultJson.blocks.map((block) => ({ ...block })),
});

export class HomeNewsGroup extends GroupBase {
  static styles = [GroupBase.styles, decoratedTitleStyles, hostGroupStyles];

  static features = [];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "inline-text",
        elementType: "h2",
        ...emptyText,
        textAlign: "left",
      },
      {
        id: "news",
        type: "news",
        children: [createDefaultNewsItem("news-1"), createDefaultNewsItem("news-2")],
      },
    ],
  };

  render() {
    return html`
      <section data-group-box>
        ${renderDecoratedTitle("News title")}
        <news-list-group
          block-id="news"
          min="0"
          max="6"
          prefix="news"
          placeholder="News"
          item-label="news"
          sort-label-block="date"
        >
          <news-group></news-group>
          <news-group></news-group>
        </news-list-group>
      </section>
      ${this.renderSortControls()}
    `;
  }
}

HomeNewsGroup.define("home-news-group");
