import { html } from "lit";
import { Layout } from "@/ui-editor";

export class HomeNewsLayoutDesign extends Layout {
  static type = "home-news";

  renderDesign() {
    return html`
      <span class="title"></span>
      ${Array.from(
        { length: 2 },
        () => html`
          <div class="card" style="min-height: 0">
            <div class="row grow">
              <span class="title" style="width: 4rem"></span>
              <span class="cols grow">
                <span class="line short"></span>
                <span class="line"></span>
              </span>
            </div>
          </div>
        `,
      )}
    `;
  }
}

HomeNewsLayoutDesign.define("layout-home-news");
