import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import { decoratedTitleStyles, renderDecoratedTitle } from "../shared/decorated-title.js";
import { emptyText } from "../shared/text-defaults.js";
import { tableGroupStyles } from "./table-group.styles.js";

export class TableGroup extends GroupBase {
  static styles = [GroupBase.styles, decoratedTitleStyles, tableGroupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "inline-text",
        elementType: "h2",
        ...emptyText,
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "description",
        type: "p",
        ...emptyText,
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "table",
        type: "table",
        cells: [
          [createDefaultCell(), createDefaultCell(), createDefaultCell()],
          [createDefaultCell(), createDefaultCell(), createDefaultCell()],
          [createDefaultCell(), createDefaultCell(), createDefaultCell()],
        ],
        headerRow: true,
        headerColumn: false,
        headerBackgroundColor: "#b3b3b3",
        bodyBackgroundColor: "#f0f0f0",
        stripedRows: false,
        stripeBackgroundColor: null,
        borderWidth: "1px",
        borderColor: "#FFFFFF",
        borderStyle: "solid",
        borderPosition: "",
        disabled: false,
      },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        ${renderDecoratedTitle("Table title")}
        <rich-text-block
          block-id="description"
          type="p"
          placeholder="Table description"
        ></rich-text-block>
        <table-block block-id="table"></table-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

TableGroup.define("table-group");

function createDefaultCell() {
  return { ...emptyText };
}
