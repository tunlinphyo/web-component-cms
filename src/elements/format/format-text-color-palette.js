import { LitElement, css, html } from "lit";

const COLORS = [
  "black",
  "red",
  "orange",
  "yellow",
  "green",
  "mint",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
];

export class FormatTextColorPalette extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    value: { type: String, reflect: true },
  };

  static styles = css`
    button {
      background: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      height: 32px;
      min-width: 32px;

    }

    button:disabled {
      opacity: 0.3;
    }

    .trigger {
      anchor-name: --color-trigger;
      color: var(--text-color, currentColor);
      font-weight: bold;
      text-decoration: underline;
      text-decoration-color: currentColor;
      text-decoration-thickness: 3px;
    }

    [popover] {
      position-anchor: --color-trigger;
      position-area: bottom;
      border: none;
      border-radius: 4px;
      grid-template-columns: repeat(4, 32px);
      gap: 4px;
      margin: 4px 0 0;
      padding: 4px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }

    [popover]:popover-open {
      display: grid;
    }

    .color {
      background: var(--color);
    }
  `;

  constructor() {
    super();
    this.disabled = false;
    this.value = "#000000";
  }

  render() {
    return html`
      <button
        class="trigger"
        type="button"
        title="Predefined text color"
        popovertarget="colors"
        ?disabled=${this.disabled}
        style=${`--text-color: ${this.value}`}
      >
        A
      </button>
      <div id="colors" popover>
        ${COLORS.map(
      (color) => html`
            <button
              class="color"
              type="button"
              title=${color}
              aria-label=${color}
              style=${`--color: var(--${color})`}
              @mousedown=${(event) => event.preventDefault()}
              @click=${() => this.#apply(color)}
            ></button>
          `,
    )}
      </div>
    `;
  }

  #apply(color) {
    const value = getComputedStyle(this).getPropertyValue(`--${color}`).trim();
    if (!value) return;

    this.dispatchEvent(
      new CustomEvent("format-command", {
        detail: { command: "foreColor", value },
        bubbles: true,
        composed: true,
      }),
    );
    queueMicrotask(() => {
      const popover = this.renderRoot.querySelector("[popover]");
      if (popover?.matches(":popover-open")) popover.hidePopover();
    });
  }
}

customElements.define("format-text-color-palette", FormatTextColorPalette);
