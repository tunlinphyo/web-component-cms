import { css } from "lit";

export const formatTextColorPaletteStyles = css`
  button {
    background: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    height: 32px;
    min-width: 32px;
  }

  button:disabled {
    opacity: 0.3;
  }

  .trigger {
    anchor-name: --color-trigger;
    color: var(--text-color, currentColor);
    font-weight: bold;
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-decoration-thickness: 3px;
  }

  [popover] {
    position-anchor: --color-trigger;
    position-area: bottom;
    border: none;
    border-radius: 4px;
    grid-template-columns: repeat(10, 32px);
    gap: 4px;
    margin: 4px 0 0;
    max-height: min(70vh, 360px);
    overflow: auto;
    padding: 4px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }

  [popover]:popover-open {
    display: grid;
  }

  .color {
    background: var(--color);
    border: 1px solid #ccc;
  }

  .color[aria-pressed="true"] {
    outline: 3px solid #2684ff;
    outline-offset: 2px;
  }

  .spacer {
    width: 32px;
    height: 32px;
  }

  .unset {
    position: relative;
    background:
      linear-gradient(to bottom right, transparent 46%, red 47% 53%, transparent 54%), white;
    border: 1px solid #ccc;
  }
`;
