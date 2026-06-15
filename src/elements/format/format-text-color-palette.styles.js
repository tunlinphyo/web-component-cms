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
    grid-template-columns: repeat(4, 32px);
    gap: 4px;
    margin: 4px 0 0;
    padding: 4px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }

  [popover]:popover-open {
    display: grid;
  }

  .color {
    background: var(--color);
    border: 1px solid var(--border-muted);
  }
`;
