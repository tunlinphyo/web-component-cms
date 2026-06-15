import { css } from "lit";

export const formatButtonDesignStyles = css`
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
    position-anchor: --button-design-trigger;
    position-area: bottom;
    width: anchor-size(width);
    margin: 4px;
    padding: 4px;
    border: none;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  }

  .trigger {
    anchor-name: --button-design-trigger;
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

  .options button {
    border: 2px solid transparent;
    border-radius: 999px;
    font-weight: 700;
    text-align: center;
  }

  .options button[data-value="primary"] {
    background: var(--brand);
    color: white;
  }

  .options button[data-value="dark"] {
    background: var(--brand-dark);
    color: white;
  }

  .options button[data-value="outline"] {
    border-color: var(--brand);
    background: transparent;
    color: var(--brand);
  }

  .options button[data-value="soft"] {
    background: var(--brand-pale);
    color: var(--brand-dark);
  }
  .options button[data-value="nav"] {
    background: transparent;
    color: var(--brand-dark);
  }
`;
