import { css } from "lit";

export const headerGroupStyles = css`
  header {
    padding-inline: 0 1rem;
  }

  rich-text-block[block-id="title"] {
    padding-inline-start: 1rem;
  }

  .container {
    display: grid;
    grid-template-columns: 180px 1fr auto;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
  }

  nav,
  header-button-block-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  header-button-block-group .empty-placeholder {
    width: auto;
    min-width: 7rem;
    min-height: 2.5rem;
    padding: 0 1rem;
    border: 1px dashed currentColor;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  image-block::part(picker) {
    min-height: 4rem;
  }
`;
