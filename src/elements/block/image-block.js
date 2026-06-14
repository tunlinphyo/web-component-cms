import { LitElement, css, html } from "lit";

export class ImageBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    src: { type: String },
    alt: { type: String },
    accept: { type: String },
    placeholder: { type: String },
    maxSize: { type: Number, attribute: "max-size", reflect: true },
    maxWidth: { type: String, attribute: "max-width", reflect: true },
    align: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.blockId = "";
    this.src = "";
    this.alt = "";
    this.accept = "image/*";
    this.placeholder = "Choose image";
    this.maxSize = 0;
    this.maxWidth = "100%";
    this.align = "left";
    this.disabled = false;
  }

  init({ id = "", src = "", alt = "", maxWidth = "100%", align = "left" } = {}) {
    this.blockId = id;
    this.src = src;
    this.alt = alt;
    this.maxWidth = maxWidth;
    this.align = align;
    return this;
  }

  toJSON() {
    return {
      id: this.blockId,
      src: this.src,
      alt: this.alt,
      maxWidth: this.maxWidth,
      align: this.align,
      type: "image",
    };
  }

  getSelectionFormat() {
    return { align: this.align, type: "image" };
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    :host([align="center"]) {
      text-align: center;
    }

    :host([align="right"]) {
      text-align: right;
    }

    .image {
      display: block;
      max-width: 100%;
    }

    .picker {
      align-items: center;
      border: 1px dashed transparent;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      max-width: 100%;
      min-height: 8rem;
      min-width: min(12rem, 100%);
      overflow: hidden;
    }

    .picker:not(.selected) {
      border-color: #888;
    }

    .picker:focus-within,
    :host(:not([disabled])[active]) .picker {
      outline: 2px solid var(--highlight);
      outline-offset: 2px;
    }

    .input {
      height: 1px;
      opacity: 0;
      position: absolute;
      width: 1px;
    }

    .controls {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-start;
      margin-top: 0.25rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    :host([disabled]) .picker {
      cursor: not-allowed;
      opacity: 0.6;
    }

    button {
      width: 2.5rem;
      height: 2.5rem;
      display: grid;
      place-content: center;
      border-radius: 50%;
      border: none;
    }

    button:not(:disabled):is(:hover,:focus-visible) {
      outline: 2px solid var(--highlight);
      outline-offset: 0;
    }
  `;

  render() {
    return html`
      <label
        class=${`picker${this.src ? " selected" : ""}`}
        part="picker"
        style=${`max-width: ${this.maxWidth}; vertical-align: top;`}
      >
        ${this.src
        ? html`<img class="image" part="image" src=${this.src} alt=${this.alt} />`
        : html`<span part="placeholder">${this.placeholder}</span>`}
        <input
          class="input"
          type="file"
          accept=${this.accept}
          ?disabled=${this.disabled || Boolean(this.src)}
          @change=${this.#imageChange}
        />
      </label>
      ${this.src
        ? html`
            <div class="controls" part="controls">
              <button
                type="button"
                aria-label="Delete image"
                title="Delete image"
                ?disabled=${this.disabled}
                @click=${this.#deleteImage}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m3 0-1 13H7L6 7"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          `
        : null}
    `;
  }

  #deleteImage = () => {
    this.src = "";
    this.renderRoot.querySelector(".input").value = "";
    this.#dispatchImageChange();
  };

  #imageChange = async (event) => {
    const [file] = event.currentTarget.files;
    if (!file) return;

    if (this.maxSize > 0 && file.size > this.maxSize) {
      event.currentTarget.value = "";
      this.dispatchEvent(
        new CustomEvent("image-error", {
          detail: { id: this.blockId, reason: "max-size", maxSize: this.maxSize, file },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    this.src = await this.#readFile(file);
    if (!this.alt) this.alt = file.name.replace(/\.[^.]+$/, "");
    this.#dispatchImageChange(file);
  };

  #dispatchImageChange(file) {
    this.dispatchEvent(
      new CustomEvent("image-change", {
        detail: { id: this.blockId, src: this.src, alt: this.alt, file },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  }
}

customElements.define("image-block", ImageBlock);
