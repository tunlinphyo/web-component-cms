import { css } from "lit";

export const borderRadiusControlStyles = css`
  :host {
    display: grid;
    gap: 0.5rem;
    width: 100%;
    font-size: 0.75rem;
  }

  .heading,
  label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .heading {
    justify-content: space-between;
  }

  .corners {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.35rem;
  }

  label:not(.mode) {
    display: grid;
    gap: 0.2rem;
  }

  input[type="number"] {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
  }

  input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
