import { css } from "lit";

export const formatButtonIconPlacementStyles = css`
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
    position-anchor: --button-icon-placement-trigger;
    position-area: bottom;
    width: anchor-size(width);
    margin: 4px;
    padding: 4px;
    border: none;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  }

  .trigger {
    anchor-name: --button-icon-placement-trigger;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
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
    outline: 2px solid var(--highlight);
    outline-offset: -2px;
  }
`;
