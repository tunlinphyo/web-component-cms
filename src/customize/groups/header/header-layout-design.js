import { html } from "lit";
import { Layout } from "@/ui-editor";

export class HeaderLayoutDesign extends Layout {
  static type = "header";

  renderDesign() {
    return html`
      <div class="row">
        <span class="logo"></span>
        <span class="spacer"></span>
        <span class="row">
          <span class="nav-button"></span>
          <span class="nav-button"></span>
          <span class="nav-button"></span>
          <span class="nav-button"></span>
        </span>
        <span class="button"></span>
      </div>
    `;
  }
}

HeaderLayoutDesign.define("layout-header");
