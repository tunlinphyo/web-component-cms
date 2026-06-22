import { css } from "lit";

export const elementTypeSelectorStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  button {
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: white;
    color: inherit;
    cursor: pointer;
    text-align: left;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  [popover] {
    position-anchor: --element-type-trigger;
    position-area: bottom;
    width: anchor-size(width);
    margin: 4px;
    padding: 4px;
    border: none;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }

  .trigger {
    anchor-name: --element-type-trigger;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    text-transform: uppercase;
  }

  .trigger::after {
    content: "";
    width: 0.35rem;
    height: 0.35rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: translateY(-25%) rotate(45deg);
  }

  .options {
    display: grid;
    gap: 4px;
  }

  .options button:hover,
  .options button[aria-pressed="true"] {
    background: var(--highlight);
    color: white;
  }

  .h1 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .h2 {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .h3 {
    font-size: 1rem;
    font-weight: bold;
  }
`;
