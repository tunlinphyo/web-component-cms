import { html } from "lit";

export function renderTableSelectionPopover({
  axis,
  index,
  rowCount,
  columnCount,
  onAdd,
  onRemove,
  onClose,
  onToggle,
}) {
  const hasSelection = ["row", "column"].includes(axis);
  const isRow = axis === "row";
  const axisLabel = isRow ? "Row" : "Column";
  const count = isRow ? rowCount : columnCount;
  const label = `${axisLabel} ${index + 1}`;

  return html`
    <div
      id="table-axis-actions"
      class="selection-popup"
      popover
      role="dialog"
      aria-label=${hasSelection ? `${label} actions` : "Table actions"}
      @toggle=${onToggle}
    >
      ${hasSelection
        ? html`
            <strong>${label}</strong>
            <button type="button" @click=${() => onAdd(axis, index)}>
              Add ${isRow ? "above" : "before"}
            </button>
            <button type="button" @click=${() => onAdd(axis, index + 1)}>
              Add ${isRow ? "below" : "after"}
            </button>
            <button
              class="delete"
              type="button"
              title=${`Delete ${axis}`}
              aria-label=${`Delete ${axis}`}
              ?disabled=${count <= 1}
              @click=${() => onRemove(axis, index)}
            >
              Delete ${axis}
            </button>
            <button
              class="close"
              type="button"
              title="Close actions"
              aria-label="Close actions"
              @click=${onClose}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          `
        : null}
    </div>
  `;
}
