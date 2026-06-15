import { css } from "lit";

export const editorOutputButtonStyles = css`
  :host {
    display: inline-flex;
  }

  button {
    padding: 0.625rem 1rem;
    color: var(--text-white);
    background-color: var(--brand);
    border: 1px solid var(--border-brand);
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 600;
  }

  button:hover {
    background-color: var(--brand-dark);
    border-color: var(--border-brand-dark);
  }

  button:focus-visible {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }
`;
