import { LitElement, html } from "lit";
import "../inline-text/inline-text-block.js";
import { getCapabilities } from "../../../registries/formatter-registry.js";
import {
  clampIndex,
  createCell,
  createCells,
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  normalizeCell,
  normalizeCells,
} from "./table-block.helpers.js";
import { tableBlockStyles } from "./table-block.styles.js";
import { renderTableSelectionPopover } from "./table-selection-popover.js";

export class TableBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    cells: { state: true },
    headerRow: { type: Boolean, attribute: "header-row", reflect: true },
    headerColumn: { type: Boolean, attribute: "header-column", reflect: true },
    headerBackgroundColor: {
      type: String,
      attribute: "header-background-color",
      reflect: true,
    },
    bodyBackgroundColor: {
      type: String,
      attribute: "body-background-color",
      reflect: true,
    },
    borderWidth: { type: String, attribute: "border-width", reflect: true },
    borderColor: { type: String, attribute: "border-color", reflect: true },
    borderStyle: { type: String, attribute: "border-style", reflect: true },
    borderPosition: { type: String, attribute: "border-position", reflect: true },
    disabled: { type: Boolean, reflect: true },
    selectedAxis: { type: String, attribute: "selected-axis", reflect: true },
    selectedIndex: { state: true },
  };

  static styles = tableBlockStyles;

  constructor() {
    super();
    this.blockId = "";
    this.cells = createCells(DEFAULT_ROWS, DEFAULT_COLUMNS);
    this.headerRow = true;
    this.headerColumn = false;
    this.headerBackgroundColor = "";
    this.bodyBackgroundColor = "";
    this.borderWidth = "1px";
    this.borderColor = "";
    this.borderStyle = "solid";
    this.borderPosition = "";
    this.disabled = false;
    this.selectedAxis = "";
    this.selectedIndex = -1;
  }

  init(options = {}) {
    const {
      id = "",
      cells = options.rows,
      headerRow = true,
      headerColumn = false,
      headerBackgroundColor = "",
      bodyBackgroundColor = "",
      borderWidth = "1px",
      borderColor = "",
      borderStyle = "solid",
      borderPosition = "",
      disabled = false,
    } = options;

    this.blockId = id;
    this.cells = normalizeCells(cells);
    this.headerRow = Boolean(headerRow);
    this.headerColumn = Boolean(headerColumn);
    this.headerBackgroundColor = String(headerBackgroundColor || "");
    this.bodyBackgroundColor = String(bodyBackgroundColor || "");
    this.borderWidth = String(borderWidth || "");
    this.borderColor = String(borderColor || "");
    this.borderStyle = String(borderStyle || "");
    this.borderPosition = ["horizontal", "vertical"].includes(borderPosition) ? borderPosition : "";
    this.disabled = Boolean(disabled);
    this.selectedAxis = "";
    this.selectedIndex = -1;
    return this;
  }

  toJSON() {
    return {
      id: this.blockId,
      type: "table",
      cells: this.#readCells(),
      headerRow: this.headerRow,
      headerColumn: this.headerColumn,
      headerBackgroundColor: this.headerBackgroundColor,
      bodyBackgroundColor: this.bodyBackgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderPosition: this.borderPosition,
      disabled: this.disabled,
    };
  }

  getSelectionFormat() {
    return {
      type: "table",
      headerRow: this.headerRow,
      headerColumn: this.headerColumn,
      headerBackgroundColor: this.headerBackgroundColor,
      bodyBackgroundColor: this.bodyBackgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderPosition: this.borderPosition,
      capabilities: getCapabilities("table"),
    };
  }

  addRow(index = this.cells.length) {
    const cells = this.#readCells();
    const insertionIndex = clampIndex(index, cells.length, true);
    cells.splice(insertionIndex, 0, Array.from({ length: cells[0].length }, createCell));
    this.cells = cells;
    this.selectedAxis = "row";
    this.selectedIndex = insertionIndex;
    this.#notifyChange();
    return true;
  }

  removeRow(index = this.cells.length - 1) {
    if (this.cells.length <= 1) return false;

    const cells = this.#readCells();
    const removalIndex = clampIndex(index, cells.length);
    cells.splice(removalIndex, 1);
    this.cells = cells;
    if (this.selectedAxis === "row") {
      this.selectedIndex = Math.min(removalIndex, cells.length - 1);
    }
    this.#notifyChange();
    return true;
  }

  addColumn(index = this.cells[0].length) {
    const cells = this.#readCells();
    const insertionIndex = clampIndex(index, cells[0].length, true);
    this.cells = cells.map((row) => {
      const nextRow = [...row];
      nextRow.splice(insertionIndex, 0, createCell());
      return nextRow;
    });
    this.selectedAxis = "column";
    this.selectedIndex = insertionIndex;
    this.#notifyChange();
    return true;
  }

  removeColumn(index = this.cells[0].length - 1) {
    if (this.cells[0].length <= 1) return false;

    const cells = this.#readCells();
    const removalIndex = clampIndex(index, cells[0].length);
    this.cells = cells.map((row) => row.filter((_, columnIndex) => columnIndex !== removalIndex));
    if (this.selectedAxis === "column") {
      this.selectedIndex = Math.min(removalIndex, this.cells[0].length - 1);
    }
    this.#notifyChange();
    return true;
  }

  setHeaderRow(enabled) {
    this.cells = this.#readCells();
    this.headerRow = Boolean(enabled);
    this.#notifyChange();
    return true;
  }

  setHeaderColumn(enabled) {
    this.cells = this.#readCells();
    this.headerColumn = Boolean(enabled);
    this.#notifyChange();
    return true;
  }

  setBlockStyle(property, value) {
    if (
      ![
        "headerBackgroundColor",
        "bodyBackgroundColor",
        "borderWidth",
        "borderColor",
        "borderStyle",
        "borderPosition",
      ].includes(property)
    ) {
      return false;
    }
    if (property === "borderPosition" && !["", "horizontal", "vertical"].includes(value)) {
      return false;
    }

    this.cells = this.#readCells();
    this[property] = value;
    if (property === "borderColor" && !value) {
      this.borderWidth = "";
      this.borderStyle = "";
    }
    if (property === "borderStyle" && (!value || value === "none")) {
      this.borderWidth = "";
      this.borderColor = "";
      this.borderPosition = "";
    }
    if (property === "borderWidth" && value && !this.borderStyle) this.borderStyle = "solid";
    if (property === "borderStyle" && value && value !== "none" && !this.borderWidth) {
      this.borderWidth = "1px";
    }
    this.#notifyChange();
    return true;
  }

  updated(changedProperties) {
    if (changedProperties.has("disabled") && this.disabled) {
      this.#clearSelection();
    }
  }

  render() {
    return html`
      ${renderTableSelectionPopover({
        axis: this.selectedAxis,
        index: this.selectedIndex,
        rowCount: this.cells.length,
        columnCount: this.cells[0].length,
        onAdd: this.#addAxis,
        onRemove: this.#removeAxis,
        onClose: this.#clearSelection,
        onToggle: this.#onPopoverToggle,
      })}
      <div class="table-scroll">
        ${!this.disabled
          ? html`
              <button
                class="table-selector"
                type="button"
                title="Select whole table"
                aria-label="Select whole table"
                aria-pressed=${this.selectedAxis === "table"}
                @click=${this.#selectTable}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="1"></rect>
                  <path d="M3 9h18M3 15h18M9 3v18M15 3v18"></path>
                </svg>
              </button>
            `
          : null}
        <table
          data-border-position=${this.borderPosition || "both"}
          style=${`
            --table-header-background: ${this.headerBackgroundColor};
            --table-body-background: ${this.bodyBackgroundColor};
            --table-border-width: ${this.borderWidth || "0"};
            --table-border-color: ${this.borderColor};
            --table-border-style: ${this.borderStyle || "none"};
          `}
        >
          ${this.headerRow
            ? html`<thead>
                ${this.#renderRow(this.cells[0], 0)}
              </thead>`
            : null}
          <tbody>
            ${this.cells
              .slice(this.headerRow ? 1 : 0)
              .map((row, index) => this.#renderRow(row, index + (this.headerRow ? 1 : 0)))}
          </tbody>
        </table>
      </div>
    `;
  }

  #renderRow(row, rowIndex) {
    return html`
      <tr>
        ${row.map((cell, columnIndex) => this.#renderCell(cell, rowIndex, columnIndex))}
      </tr>
    `;
  }

  #renderCell(cell, rowIndex, columnIndex) {
    const selected =
      (this.selectedAxis === "row" && this.selectedIndex === rowIndex) ||
      (this.selectedAxis === "column" && this.selectedIndex === columnIndex);
    const className = selected ? "selected" : "";
    const editor = html`
      <div class="cell-content">
        ${!this.disabled && rowIndex === 0
          ? html`
              <button
                class="axis-selector column-selector"
                type="button"
                aria-label=${`Select column ${columnIndex + 1}`}
                aria-controls="table-axis-actions"
                aria-expanded=${this.selectedAxis === "column" &&
                this.selectedIndex === columnIndex}
                aria-haspopup="dialog"
                aria-pressed=${this.selectedAxis === "column" && this.selectedIndex === columnIndex}
                @click=${() => this.#selectAxis("column", columnIndex)}
              >
                ${columnIndex + 1}
              </button>
            `
          : null}
        ${!this.disabled && columnIndex === 0
          ? html`
              <button
                class="axis-selector row-selector"
                type="button"
                aria-label=${`Select row ${rowIndex + 1}`}
                aria-controls="table-axis-actions"
                aria-expanded=${this.selectedAxis === "row" && this.selectedIndex === rowIndex}
                aria-haspopup="dialog"
                aria-pressed=${this.selectedAxis === "row" && this.selectedIndex === rowIndex}
                @click=${() => this.#selectAxis("row", rowIndex)}
              >
                ${rowIndex + 1}
              </button>
            `
          : null}
        <inline-text
          class="cell-editor"
          block-id=${`cell-${rowIndex}-${columnIndex}`}
          type="p"
          placeholder="Text"
          .value=${cell.value}
          .textAlign=${cell.textAlign}
          .fontWeight=${cell.fontWeight}
          .fontSize=${cell.fontSize}
          .fontFamily=${cell.fontFamily}
          ?disabled=${this.disabled}
          predefined-margin="0"
          features="fontFamily,fontSize,bold,italic,underline,align,link"
        ></inline-text>
      </div>
    `;

    if (this.headerRow && rowIndex === 0) {
      return html`<th class=${className} scope="col">${editor}</th>`;
    }
    if (this.headerColumn && columnIndex === 0) {
      return html`<th class=${className} scope="row">${editor}</th>`;
    }
    return html`<td class=${className}>${editor}</td>`;
  }

  #addAxis = (axis, index) => (axis === "row" ? this.addRow(index) : this.addColumn(index));

  #removeAxis = (axis, index) =>
    axis === "row" ? this.removeRow(index) : this.removeColumn(index);

  async #selectAxis(axis, index) {
    if (this.selectedAxis === axis && this.selectedIndex === index) {
      this.#clearSelection();
      return;
    }

    this.selectedAxis = axis;
    this.selectedIndex = index;
    await this.updateComplete;
    if (!this.#selectionPopover?.matches(":popover-open")) {
      this.#selectionPopover?.showPopover();
    }
  }

  #selectTable = () => {
    if (this.selectedAxis === "table") {
      this.#clearSelection();
      return;
    }

    if (this.#selectionPopover?.matches(":popover-open")) {
      this.#selectionPopover.hidePopover();
    }
    this.selectedAxis = "table";
    this.selectedIndex = -1;
  };

  clearSelection() {
    this.#clearSelection();
  }

  #clearSelection = () => {
    const popover = this.#selectionPopover;
    if (popover?.matches(":popover-open")) popover.hidePopover();
    this.selectedAxis = "";
    this.selectedIndex = -1;
  };

  #onPopoverToggle = (event) => {
    if (event.newState !== "closed" || !["row", "column"].includes(this.selectedAxis)) {
      return;
    }

    this.selectedAxis = "";
    this.selectedIndex = -1;
  };

  get #selectionPopover() {
    return this.renderRoot.querySelector("#table-axis-actions");
  }

  #readCells() {
    const editors = [...this.renderRoot.querySelectorAll(".cell-editor")];
    if (editors.length !== this.cells.flat().length) {
      return this.cells.map((row) => row.map(normalizeCell));
    }

    const values = editors.map((editor) => {
      const { value, textAlign, fontWeight, fontSize, fontFamily } = editor.toJSON();
      return { value, textAlign, fontWeight, fontSize, fontFamily };
    });
    let offset = 0;
    return this.cells.map((row) => {
      const nextRow = values.slice(offset, offset + row.length);
      offset += row.length;
      return nextRow;
    });
  }

  #notifyChange() {
    this.dispatchEvent(
      new CustomEvent("editor-change", {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("table-block", TableBlock);
