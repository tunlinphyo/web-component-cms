import { css } from "lit";

export const formatButtonDesignStyles = css`
  .options button:hover,
  .options button[aria-pressed="true"] {
    outline: 2px solid var(--highlight);
    outline-offset: -2px;
  }

  .options button {
    padding-block: 0.5rem;
    border: 2px solid transparent;
    border-radius: 999px;
    font-weight: 700;
    text-align: center;
  }

  .options button[data-value="primary"] {
    background: var(--brand-500);
    color: white;
  }

  .options button[data-value="dark"] {
    background: var(--brand-600);
    color: white;
  }

  .options button[data-value="outline"] {
    border-color: var(--brand-500);
    background: transparent;
    color: var(--brand-500);
  }

  .options button[data-value="soft"] {
    background: var(--brand-50);
    color: var(--brand-600);
  }

  .options button[data-value="nav"] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: transparent;
    color: var(--brand-900);
  }
`;
