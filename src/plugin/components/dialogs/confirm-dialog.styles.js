import { css } from "lit";

export const confirmDialogStyles = css`
  dialog {
    width: min(24rem, calc(100vw - 2rem));
    padding: 1rem;
    border: 1px solid #999;
    border-radius: 0.5rem;
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 0.35);
  }

  h2 {
    margin-block: 0 0.5rem;
  }

  p {
    margin-block: 0 1rem;
  }

  menu {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
  }

  button {
    padding: 0.35rem 0.75rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  button:not(:disabled):is(:hover, :focus-visible) {
    outline: 2px solid var(--ui-editor-highlight);
    outline-offset: 0;
  }

  .confirm {
    background: var(--ui-editor-primary);
    color: white;
  }
`;
