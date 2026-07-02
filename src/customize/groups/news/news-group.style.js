import { css } from "lit";

export const hostGroupStyles = css`
  :host {
    grid-column: span 2;
    display: grid;
    grid-template-columns: subgrid;
  }

  [data-group-box] {
    grid-column: span 2;
    display: grid;
    grid-template-columns: subgrid;
    gap: 0.75rem;
    padding: 2rem;

    align-items: center;
  }
`;
