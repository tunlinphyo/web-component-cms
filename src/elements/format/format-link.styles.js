import { css } from "lit";

export const formatLinkStyles = css`
  :host {
    display: inline-flex;
  }
  button,
  input {
    box-sizing: border-box;
    height: 32px;
  }

  button {
    background: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    min-width: 32px;
  }

  svg {
    display: block;
    fill: none;
    margin: auto;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  :host > button {
    anchor-name: --link-trigger;
  }

  :host([applied]) > button {
    background: var(--highlight);
    color: white;
  }

  [popover] {
    position-anchor: --link-trigger;
    position-area: bottom;
    border: none;
    border-radius: 4px;
    margin: 4px;
    padding: 4px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 4px;
  }
`;
