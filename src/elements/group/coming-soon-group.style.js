import { css } from "lit";

export const hostGroupStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: Canvas;
    padding: 0px;
  }
  [data-group-box] {
    width: max-content;
    margin: 0 auto;
    background-color: var(--gray-25);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    margin-block: 2rem;
  }

  icon-blockp::part(container) {
    background-color: var(--border-brand);
    color: #fff;
  }
`;
