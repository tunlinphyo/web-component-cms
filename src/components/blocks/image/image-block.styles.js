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
    max-height: 100%;
    max-width: 100%;
  }

  .picker {
    align-items: center;
    border: 1px dashed transparent;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
    background-color: transparent;
  }

  .picker:not(.selected) {
    border-color: #888;
  }

  .picker.selected {
    cursor: default;
  }

  .picker:focus-visible,
  :host([active]) .picker {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
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
    opacity: 0.6;
  }

  button:not(.picker):not(.image-option) {
    width: 2rem;
    height: 2rem;
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

  dialog {
    border: 1px solid var(--border, #d0d0d0);
    border-radius: 0.5rem;
    max-width: min(48rem, calc(100vw - 2rem));
    padding: 1rem;
    width: 42rem;
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 0.32);
  }

  .dialog-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .image-list {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    max-height: min(32rem, 70vh);
    overflow: auto;
  }

  .image-option {
    align-content: start;
    background: transparent;
    border: 1px solid var(--border, #d0d0d0);
    border-radius: 0.5rem;
    color: inherit;
    cursor: pointer;
    display: grid;
    gap: 0.5rem;
    padding: 0.5rem;
    text-align: left;
  }

  .image-option img {
    aspect-ratio: 4 / 3;
    background: #f5f5f5;
    border-radius: 0.25rem;
    object-fit: cover;
    width: 100%;
  }

  .image-option span {
    font-size: 0.75rem;
    overflow-wrap: anywhere;
  }

  .empty {
    margin: 0;
  }
`;
