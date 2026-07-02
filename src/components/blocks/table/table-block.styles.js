import { css } from "lit";

export const tableBlockStyles = css`
  :host {
    display: block;
  }

  :host([selected-axis="table"]) {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  .selection-popup {
    position-anchor: --table-axis-trigger;
    position-area: bottom;
    width: fit-content;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem;
    padding: 0.5rem;
    border: 1px solid var(--gray-300);
    border-radius: 0.5rem;
    background: white;
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.12);
  }

  .selection-popup:popover-open {
    display: flex;
  }

  .selection-popup strong {
    padding-inline: 0.25rem;
    font-size: 0.875rem;
  }

  .selection-popup .delete {
    color: #b42318;
  }

  .selection-popup .close {
    width: 2rem;
    padding: 0;
    font-size: 1.25rem;
    border-radius: 50%;
    background-color: var(--gray-100);
    border: none;
  }

  button {
    min-height: 2rem;
    padding-inline: 0.75rem;
    border: 1px solid var(--gray-300);
    border-radius: 0.375rem;
    background: white;
    color: inherit;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .selection-popup button:not(:disabled):is(:hover, :focus-visible) {
    outline: 2px solid var(--highlight);
    outline-offset: 0;
  }

  .table-scroll {
    position: relative;
    padding-block-start: 2rem;
    padding-inline-start: 2rem;
    overflow-x: auto;
  }

  .table-selector {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    display: grid;
    width: 1.5rem;
    min-height: 1.5rem;
    padding: 0;
    border-radius: 0.25rem;
    place-items: center;
    color: var(--gray-700);
  }

  .table-selector svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }

  .table-selector[aria-pressed="true"] {
    border-color: var(--brand-600);
    background: var(--brand-600);
    color: white;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    min-width: 8rem;
    padding: 0.625rem;
    border: 0 var(--table-border-style) var(--table-border-color);
    vertical-align: top;
    background: var(--table-body-background);
    color: var(--brand-800);
  }

  table[data-border-position="both"] :is(th, td) {
    border-width: var(--table-border-width);
  }

  table[data-border-position="horizontal"] :is(th, td) {
    border-block-width: var(--table-border-width);
  }

  table[data-border-position="vertical"] :is(th, td) {
    border-inline-width: var(--table-border-width);
  }

  th.selected,
  td.selected {
    background: #89dcf8;
    box-shadow: inset 0 0 0 2px var(--highlight);
  }

  th {
    background: var(--table-header-background);
    color: var(--white);
    font-weight: 700;
    text-align: start;
  }

  .cell-content {
    position: relative;
  }

  .axis-selector {
    position: absolute;
    display: grid;
    width: 1.5rem;
    min-height: 1.5rem;
    padding: 0;
    border-radius: 50%;
    place-items: center;
    color: var(--gray-700);
    font-size: 0.75rem;
  }

  .axis-selector[aria-pressed="true"] {
    anchor-name: --table-axis-trigger;
    border-color: var(--brand-600);
    background: var(--brand-600);
    color: white;
  }

  .column-selector {
    bottom: calc(100% + 1rem);
    left: 50%;
    translate: -50% 0;
  }

  .row-selector {
    top: 50%;
    right: calc(100% + 1rem);
    translate: 0 -50%;
  }

  .cell-editor::part(editor) {
    min-height: 1.5em;
  }

  :host([disabled]) .selection-popup {
    display: none;
  }

  @media (max-width: 40rem) {
    .selection-popup {
      align-items: stretch;
      flex-direction: column;
      width: auto;
    }
  }
`;
