import { css } from "lit";

export const richTextBlockStyles = css`
  :host {
    display: block;
  }

  .editor {
    box-sizing: border-box;
    outline: none;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  :host(:not([disabled])) .editor:focus,
  :host(:not([disabled])[active]) .editor,
  :host(:not([disabled])[has-format-selection]) .editor {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  .editor:empty::before {
    content: attr(data-placeholder);
    color: #888;
    pointer-events: none;
  }

  .editor > p:only-child:empty::before {
    content: var(--placeholder);
    color: #888;
    pointer-events: none;
  }

  mark {
    background-color: var(--highlight);
    padding-inline: 0.25rem;
    border-radius: 2px;
  }

  [data-link-selection] {
    text-decoration: underline;
  }

  :host([disabled]) .editor {
    opacity: 0.6;
    cursor: not-allowed;
    user-select: none;
  }

  p {
    margin-block: 0.5rem;
  }
`;
