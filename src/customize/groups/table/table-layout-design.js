import { html } from "lit";
import { Layout } from "@/ui-editor";

export class TableLayoutDesign extends Layout {
  static type = "table";

  renderDesign() {
    return html`
      <span class="title"></span>
      <div class="stack">
        <span class="line"></span>
        <span class="line medium"></span>
      </div>
      <div class="table-preview">
        ${Array.from({ length: 9 }, () => html`<span class="table-cell"></span>`)}
      </div>
    `;
  }
}

TableLayoutDesign.define("layout-table");
