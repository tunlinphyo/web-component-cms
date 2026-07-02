import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";
import { decoratedTitleStyles, renderDecoratedTitle } from "../shared/decorated-title.js";
import { tableGroupStyles } from "./table-group.styles.js";

export class TableGroup extends GroupBase {
  static styles = [GroupBase.styles, decoratedTitleStyles, tableGroupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "h2",
        value: "",
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "description",
        type: "p",
        value: "",
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "table",
        type: "table",
        cells: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        headerRow: true,
        headerColumn: false,
        headerBackgroundColor: "#EC83A1",
        bodyBackgroundColor: "#FBDFE7",
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

customElements.define("table-group", TableGroup);
