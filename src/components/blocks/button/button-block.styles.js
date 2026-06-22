import { css } from "lit";

export const buttonBlockStyles = css`
  :host {
    display: block;
  }

  :host([align="center"]) {
    text-align: center;
  }

  :host([align="right"]) {
    text-align: right;
  }

  .button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: auto;
    min-width: 2rem;
    height: 2.5rem;
    padding: 0 1.5rem;
    border: 2px solid transparent;
    border-radius: 999px;
    font-size: 14px;
    font: inherit;
    font-weight: 700;
    text-align: center;

    .icon-picker-trigger {
      width: 2rem;
      height: 2rem;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .button:focus-within,
  :host([active]) .button {
    outline: 2px solid var(--highlight);
    outline-offset: 2px;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  :host([icon-position="end"]) .icon-picker-trigger {
    order: 1;
  }

  :host([icon-position="start"]) .button {
    padding-inline-start: 0.5rem;
  }

  :host([icon-position="end"]) .button {
    padding-inline-end: 0.5rem;
  }

  .text {
    display: inline-block;
    min-width: 1ch;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: inherit;
    text-align: inherit;
    white-space: nowrap;
  }

  .text:empty::before {
    color: color-mix(in srgb, currentColor 55%, transparent);
    content: attr(data-placeholder);
  }

  :host([design="primary"]) .button {
    background: var(--brand);
    color: white;
  }

  :host([design="dark"]) .button {
    background: var(--brand-dark);
    color: white;
  }

  :host([design="outline"]) .button {
    border-color: var(--brand);
    background: transparent;
    color: var(--brand);
  }

  :host([design="soft"]) .button {
    background: var(--brand-pale);
    color: var(--brand-dark);
  }

  :host([design="nav"]) .button {
    background: transparent;
    color: var(--text-ink);
    padding-inline: 0.5rem;

    .icon-picker-trigger {
      width: 2rem;
      height: 2rem;
      background-color: var(--text-brand);
      color: #fff;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  :host([disabled]) .button {
    cursor: not-allowed;
    opacity: 0.6;
  }

  button {
    border: none;
    background: white;
    color: inherit;
    cursor: pointer;
  }

  .icon-picker-trigger,
  .icon-options button {
    display: inline-grid;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.5rem;
    border-radius: 50%;
    place-items: center;
  }

  .icon-picker-trigger {
    anchor-name: --button-icon-picker-trigger;
    width: 1em;
    height: 1em;
    padding: 0;
    background: transparent;
  }

  .icon-picker-trigger:hover,
  .icon-picker-trigger:focus-visible,
  [popover] button:hover,
  [popover] button[aria-pressed="true"] {
    outline: 2px solid var(--highlight);
    outline-offset: 1px;
  }

  [popover] {
    position-anchor: --button-icon-picker-trigger;
    position-area: bottom;
    margin: 4px;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  }

  .icon-options {
    display: grid;
    grid-template-columns: repeat(4, 2.25rem);
    gap: 0.25rem;
  }
`;
