import { css } from "lit";

export const iconBlockStyles = css`
  :host {
    display: block;
  }

  :host([align="center"]) {
    text-align: center;
  }

  :host([align="right"]) {
    text-align: right;
  }

  button,
  .input {
    display: inline-grid;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0.625rem;
    border: none;
    border-radius: 50%;
    background: white;
    color: inherit;
    cursor: pointer;
    place-items: center;
    text-decoration: none;
  }

  button:disabled,
  :host([disabled]) .input {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .input:hover,
  .input:focus-visible,
  :host([active]) .input,
  .options button:hover,
  .options button[aria-pressed="true"] {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  [popover] {
    position-anchor: --icon-block-trigger;
    position-area: bottom;
    margin: 4px;
    padding: 4px;
    border: none;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  }

  .input {
    anchor-name: --icon-block-trigger;
    width: 1em;
    height: 1em;
    padding: 0.25em;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(3, 2.75rem);
    gap: 4px;
  }

  .icon {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }
`;
