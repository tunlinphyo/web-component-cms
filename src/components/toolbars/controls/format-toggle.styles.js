import { css } from "lit";

export const formatToggleStyles = css`
  button {
    background: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    height: 32px;
    min-width: 32px;
  }

  button:disabled {
    opacity: 0.5;
  }

  :host([applied]) button {
    background: var(--highlight);
    color: white;
  }

  mark {
    background-color: transparent;
    background-image: linear-gradient(var(--yellow-200), var(--yellow-200));
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 100% 40%;
  }
`;
