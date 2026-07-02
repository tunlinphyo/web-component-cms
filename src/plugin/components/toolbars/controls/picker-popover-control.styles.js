import { css } from "lit";

export const pickerPopoverControlStyles = css`
  :host {
    display: block;
    width: 100%;
    flex: 1;
  }

  button {
    box-sizing: border-box;
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    background: var(--white, white);
    color: inherit;
    cursor: pointer;
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
    font-size: 0.75rem;
  }

  .trigger::after {
    content: "";
    width: 0.5rem;
    height: 0.3rem;
    background-color: var(--gray-400);
    mask: center / contain no-repeat
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 5'%3E%3Cpath d='M0 0h10L5 5z'/%3E%3C/svg%3E");
  }

  .trigger:has(+ [popover]:popover-open)::after {
    rotate: 180deg;
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
