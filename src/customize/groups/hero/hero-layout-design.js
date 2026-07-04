import { html } from "lit";
import { Layout } from "@/ui-editor";

export class HeroLayoutDesign extends Layout {
  static type = "hero";

  renderDesign() {
    return html`
      <div class="split">
        <span class="stack">
          <span class="title"></span>
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
          <span class="line medium"></span>
        </span>
        <span class="media"></span>
      </div>
    `;
  }
}

HeroLayoutDesign.define("layout-hero");
