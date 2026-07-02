import { html } from "lit";
import "./news-list-group.js";
import { NewsGroup } from "../news/news-group.js";
import { GroupBase } from "../../../plugin/index.js";
import { decoratedTitleStyles, renderDecoratedTitle } from "../shared/decorated-title.js";
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
        type: "h2",
        value: "",
        textAlign: "left",
      },
      {
        id: "news",
        type: "news",
        children: [
          createDefaultNewsItem("news-1"),
          createDefaultNewsItem("news-2"),
        ],
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

customElements.define("home-news-group", HomeNewsGroup);
