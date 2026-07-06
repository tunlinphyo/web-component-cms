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
    background: white;
    color: inherit;
    cursor: pointer;
    place-items: center;
    text-decoration: none;
  }

  button {
    border-radius: 50%;
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
    outline: 2px solid var(--ui-editor-highlight);
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
    border: 1px solid transparent;
    vertical-align: top;
  }

  .input[data-empty] {
    border-color: var(--gray-300);
    border-style: dashed;
  }

  .input .material-symbol {
    font-size: 1em;
  }
`;
