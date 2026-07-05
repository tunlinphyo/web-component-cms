import { css } from "lit";

export const tableGroupStyles = css`
  :host {
    display: block;
  }

  [data-group-box] {
    display: grid;
    gap: 0;
    padding: 3rem 2rem;
  }

  rich-text-block[block-id="description"] {
    line-height: 1.7;
  }

  table-block {
    margin-block-start: 1rem;
  }
`;
