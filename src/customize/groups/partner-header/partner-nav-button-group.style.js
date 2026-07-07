import { css } from "lit";

export const partnerNavButtonStyles = css`
  :host {
    display: inline-block;
  }

  .button-group-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.5rem;
    padding-inline: 0.5rem;
    color: var(--brand-900);
    background-color: transparent;
    text-decoration: none;
  }

  :host([disabled]) .button-group-item {
    cursor: not-allowed;
    opacity: 0.55;
  }

  icon-block {
    font-size: 1rem;
  }

  inline-text {
    min-width: 3ch;
  }

  inline-text::part(editor) {
    white-space: nowrap;
  }
`;
