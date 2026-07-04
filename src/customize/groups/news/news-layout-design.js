import { html } from "lit";
import { Layout } from "@/ui-editor";

export class NewsLayoutDesign extends Layout {
  static type = "news";

  renderDesign() {
    return html`
      <div class="row"><span class="circle"></span><span class="title"></span></div>
      <span class="line"></span>
      <span class="line"></span>
      <span class="line medium"></span>
    `;
  }
}

NewsLayoutDesign.define("layout-news");
