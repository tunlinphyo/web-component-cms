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

  nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  image-block::part(picker) {
    min-height: 4rem;
  }
`;
