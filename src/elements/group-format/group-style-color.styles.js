import { css } from "lit";

export const groupStyleColorStyles = css`
  :host {
    display: grid;
    gap: 0.25rem;
    font-size: 0.75rem;
  }

  button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .trigger {
    anchor-name: --group-color-trigger;
    display: grid;
    place-content: center;
  }

  .preview {
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 3px solid var(--preview-color);
    border-radius: 3px;
    background: var(--preview-background);
  }

  [popover] {
    position-anchor: --group-color-trigger;
    position-area: bottom;
    border: none;
    border-radius: 4px;
    grid-template-columns: repeat(4, 32px);
    gap: 4px;
    margin: 4px 0 0;
    padding: 4px;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  }

  [popover]:popover-open {
    display: grid;
  }

  .color {
    background: var(--color);
  }

  .unset {
    position: relative;
    background:
      linear-gradient(to bottom right, transparent 46%, red 47% 53%, transparent 54%), white;
    border: 1px solid #ccc;
  }
`;
