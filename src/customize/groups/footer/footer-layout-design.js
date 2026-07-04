import { html } from "lit";
import { Layout } from "@/ui-editor";

export class FooterLayoutDesign extends Layout {
  static type = "footer";

  renderDesign() {
    return html`
      <div class="row">
        <div class="row baseline">
          <span class="logo"></span>
          <span class="logo"></span>
          <span class="logo"></span>
          <span class="spacer"></span>
          <span class="line" style="width: 6rem"></span>
        </div>
      </div>
    `;
  }
}

FooterLayoutDesign.define("layout-footer");
