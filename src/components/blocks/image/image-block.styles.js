import { css } from "lit";

export const imageBlockStyles = css`
  :host {
    display: block;
    position: relative;
  }

  :host([align="center"]) {
    text-align: center;
  }

  :host([align="right"]) {
    text-align: right;
  }

  .image {
    display: block;
    max-width: 100%;
  }

  .picker {
    align-items: center;
    border: 1px dashed transparent;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    max-width: 100%;
    min-height: 8rem;
    min-width: min(12rem, 100%);
    overflow: hidden;
  }

  .picker:not(.selected) {
    border-color: #888;
  }

  .picker.selected {
    cursor: default;
  }

  .picker:focus-within,
  :host(:not([disabled])[active]) .picker {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  .input {
    height: 1px;
    opacity: 0;
    position: absolute;
    width: 1px;
  }

  .controls {
    display: flex;
    gap: 0.25rem;
    justify-content: flex-start;
    margin-top: 0.25rem;
    position: absolute;
    top: 0;
    right: 0;
  }

  :host([disabled]) .picker {
    cursor: not-allowed;
    opacity: 0.6;
  }

  button {
    width: 2.5rem;
    height: 2.5rem;
    display: grid;
    place-content: center;
    border-radius: 50%;
    border: none;
    background-color: oklch(from Canvas l c h / 0.5);
    backdrop-filter: blur(2px);
    cursor: pointer;
  }

  button:not(:disabled):is(:hover, :focus-visible) {
    outline: 2px solid var(--highlight);
    outline-offset: 0;
  }
`;
