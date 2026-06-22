import { css } from "lit";

export const groupStyleSelectorStyles = css`
  label {
    display: grid;
    width: 100%;
    gap: 0.25rem;
    font-size: 0.75rem;
  }

  select {
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background: white;
    color: inherit;
    cursor: pointer;
    font: inherit;
  }

  select:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
