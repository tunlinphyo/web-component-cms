import { css } from "lit";

export const hostGroupStyles = css`
  :host {
    display: block;
  }
  [data-group-box] {
    padding: 4rem 2rem;
    display: grid;
    gap: 4rem;
  }

  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
  }

  .description-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    line-height: 1.8;
    gap: 1rem;
  }

  :host([group-id="d20f50d5-ddd6-4614-a124-349fc2d5b701"]) .description-group {
    grid-template-columns: 0.8fr 1fr;
  }

  image-block::part(picker) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
