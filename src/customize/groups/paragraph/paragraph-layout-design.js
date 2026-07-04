import { html } from "lit";
import { Layout } from "@/ui-editor";

export class ParagraphLayoutDesign extends Layout {
  static type = "paragraph";

  renderDesign() {
    return html`
      <span class="title"></span>
      <span class="line"></span>
      <span class="line"></span>
      <span class="line medium"></span>
    `;
  }
}

ParagraphLayoutDesign.define("layout-paragraph");
