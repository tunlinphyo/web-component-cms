import { css } from "lit";

export const richTextBlockStyles = css`
  :host {
    display: block;
  }

  h1,
  h2,
  h3 {
    margin-block: var(--predefined-margin, 0.5rem);
  }

  b {
    font-weight: 700;
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
    background-color: transparent;
    background-image: linear-gradient(
      var(--mark-highlight-color, var(--yellow-200)),
      var(--mark-highlight-color, var(--yellow-200))
    );
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 100% 40%;
  }

  [data-link-selection] {
    text-decoration: underline;
  }

  :host([disabled]) .editor {
    opacity: 0.6;
    cursor: not-allowed;
    user-select: none;
  }

  :host([type="p"]) p {
    margin-block: var(--predefined-margin, 0.5rem);
  }
`;
