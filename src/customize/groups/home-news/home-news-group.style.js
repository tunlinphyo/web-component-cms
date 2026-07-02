import { css } from "lit";

export const hostGroupStyles = css`
  :host {
    display: block;
  }

  [data-group-box] {
    display: grid;
    gap: 1.5rem;
    padding: 3rem 2rem;
  }

  news-list-group {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }

  news-group::part(sort-controls) {
    display: none;
  }
`;
