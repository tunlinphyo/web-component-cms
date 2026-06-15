import { css } from "lit";

export const groupBaseStyles = css`
  :host {
    display: block;
    padding: 0;
  }

  [data-group-box] {
    background-color: Canvas;
  }

  :host([active]) [data-group-box] {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  .sort-controls {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.5rem;
    background-color: #efefef;
    /* opacity: 0;
      pointer-events: none; */
  }

  button {
    width: 2.5rem;
    height: 2.5rem;
    display: grid;
    place-content: center;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: Canvas;
  }

  button:not(:disabled):is(:hover, :focus-visible) {
    outline: 2px solid var(--highlight);
    outline-offset: 0;
  }

  /* :host(:hover) .sort-controls,
    :host(:focus-within) .sort-controls {
      opacity: 1;
      pointer-events: auto;
    } */
`;
