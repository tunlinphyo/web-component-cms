import { css } from "lit";

export const partnerHeaderGroupStyles = css`
  header {
    padding-inline: 1rem;
  }

  .container {
    display: grid;
    grid-template-columns: 180px 1fr auto;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
  }

  partner-nav-button-list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  partner-nav-button::part(sort-controls) {
    display: none;
  }

  partner-nav-button-list .empty-placeholder {
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
    width: auto;
    min-height: 4rem;
  }

  image-block::part(image) {
    width: auto;
    height: 100%;
  }
`;
