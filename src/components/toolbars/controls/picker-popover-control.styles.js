import { css } from "lit";

export const pickerPopoverControlStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  button {
    box-sizing: border-box;
    width: 100%;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    background: var(--white, white);
    color: inherit;
    cursor: pointer;
    font-size: 0.9rem;
    text-align: left;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .trigger {
    anchor-name: --picker-trigger;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .trigger::after {
    content: "";
    width: 0.35rem;
    height: 0.35rem;
    border-right: 1px solid currentColor;
    border-bottom: 1px solid currentColor;
    transform: translateY(-25%) rotate(45deg);
  }

  [popover] {
    position-anchor: --picker-trigger;
    position-area: bottom;
    width: anchor-size(width);
    margin: 4px;
    padding: 4px;
    border: none;
    border-radius: 0.5rem;
    background: var(--white, white);
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
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
`;
