import { html } from "lit";
import { Layout } from "@/ui-editor";

export class AboutLayoutDesign extends Layout {
  static type = "about";

  renderDesign() {
    return html`
      <div class="stack">
        <span class="title"></span>
        <span class="line"></span>
        <span class="line"></span>
        <span class="line medium"></span>
      </div>
    `;
  }
}

AboutLayoutDesign.define("layout-about");
