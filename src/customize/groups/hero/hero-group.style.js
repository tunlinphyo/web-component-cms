import { css } from "lit";

export const groupStyles = css`
  [data-group-box] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 2rem;
  }

  .detail {
    display: grid;
    place-content: center;
  }

  .media {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
  }

  /* icon-block::part(container) {
    width: 2rem;
    height: 2rem;
  } */

  image-block {
    display: grid;
    max-width: 20rem;
    max-height: 30rem;
  }
  image-block::part(picker) {
    min-width: 12rem;
    min-height: 20rem;
  }
`;
