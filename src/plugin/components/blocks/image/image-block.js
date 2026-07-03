import { LitElement, html } from "lit";
import { imageBlockStyles } from "./image-block.styles.js";
import { getCapabilities, toFeatureAttribute } from "../../../registries/formatter-registry.js";

export class ImageBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    src: { type: String },
    alt: { type: String },
    images: { attribute: false },
    placeholder: { type: String },
    objectFit: { type: String, attribute: "object-fit", reflect: true },
    align: { type: String, reflect: true },
    link: { type: String },
    target: { type: String, reflect: true },
    backgroundColor: { type: String, attribute: "background-color", reflect: true },
    borderWidth: { type: String, attribute: "border-width", reflect: true },
    borderColor: { type: String, attribute: "border-color", reflect: true },
    borderStyle: { type: String, attribute: "border-style", reflect: true },
    borderPosition: { type: String, attribute: "border-position", reflect: true },
    borderRadius: { type: String, attribute: "border-radius", reflect: true },
    disabled: { type: Boolean, reflect: true },
    features: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.blockId = "";
    this.src = "";
    this.alt = "";
    this.images = [];
    this.placeholder = "Choose image";
    this.objectFit = "none";
    this.align = "left";
    this.link = "";
    this.target = "_self";
    this.backgroundColor = "";
    this.borderWidth = "";
    this.borderColor = "";
    this.borderStyle = "";
    this.borderPosition = "";
    this.borderRadius = "";
    this.disabled = false;
    this.features = undefined;
  }

  init(options = {}) {
    const {
      id = "",
      src = "",
      alt = "",
      objectFit = "none",
      align = "left",
      link = "",
      target = "_self",
      backgroundColor = "",
      borderWidth = "",
      borderColor = "",
      borderStyle = "",
      borderPosition = "",
      borderRadius = "",
      disabled = false,
    } = options;

    this.blockId = id;
    this.src = src;
    this.alt = alt;
    this.objectFit = normalizeObjectFit(objectFit);
    this.align = align;
    this.link = link;
    this.target = target || "_self";
    this.backgroundColor = backgroundColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.borderStyle = borderStyle;
    this.borderPosition = borderPosition;
    this.borderRadius = borderRadius;
    this.disabled = disabled;
    if (Object.hasOwn(options, "features")) {
      this.features = toFeatureAttribute(options.features);
    }
    return this;
  }

  toJSON() {
    return {
      id: this.blockId,
      src: this.src,
      alt: this.alt,
      objectFit: this.objectFit,
      align: this.align,
      link: this.link,
      target: this.link ? this.target : "_self",
      backgroundColor: this.backgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderPosition: this.borderPosition,
      borderRadius: this.borderRadius,
      disabled: this.disabled,
      type: "image",
    };
  }

  getSelectionFormat() {
    return {
      align: this.align,
      objectFit: this.objectFit,
      link: this.link,
      target: this.target,
      backgroundColor: this.backgroundColor,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderPosition: this.borderPosition,
      borderRadius: this.borderRadius,
      disabled: this.disabled,
      type: "image",
      capabilities: getCapabilities("image", this.features),
    };
  }

  static styles = imageBlockStyles;

  render() {
    return html`
      <button
        class=${`picker${this.src ? " selected" : ""}`}
        part="picker"
        type="button"
        style=${`vertical-align: top; background-color: ${this.backgroundColor}; border-width: ${toBorderWidthValue(this.borderWidth, this.borderPosition)}; border-color: ${this.borderColor}; border-style: ${this.borderStyle}; border-radius: ${this.borderRadius};`}
        @click=${this.#handlePickerClick}
      >
        ${this.src
          ? html`<img
              class="image"
              part="image"
              src=${this.src}
              alt=${this.alt}
              style=${`object-fit: ${this.objectFit};`}
            />`
          : html`<span part="placeholder">${this.placeholder}</span>`}
      </button>
      ${this.src
        ? html`
            <div class="controls" part="controls">
              <button
                type="button"
                aria-label="Edit image"
                title="Edit image"
                @click=${this.#openPicker}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Delete image"
                title="Delete image"
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
      <dialog>
        <div class="dialog-header">
          <strong>Choose image</strong>
          <button type="button" aria-label="Close image picker" @click=${this.#closePicker}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <div class="image-list">
          ${this.images.length
            ? this.images.map((image) => this.#renderImageOption(image))
            : html`<p class="empty">No images available.</p>`}
        </div>
      </dialog>
    `;
  }

  #handlePickerClick = () => {
    if (!this.src) this.#openPicker();
  };

  #deleteImage = () => {
    this.src = "";
    this.#dispatchImageChange();
  };

  setBorderRadius(borderRadius) {
    this.borderRadius = borderRadius;
    return true;
  }

  setObjectFit(objectFit) {
    if (!OBJECT_FIT_VALUES.has(objectFit)) return false;
    this.objectFit = objectFit;
    return true;
  }

  setBlockStyle(property, value) {
    if (
      !["backgroundColor", "borderWidth", "borderColor", "borderStyle", "borderPosition"].includes(
        property,
      )
    ) {
      return false;
    }

    this[property] = value;
    if (property === "borderColor" && !value) {
      this.borderWidth = "";
      this.borderStyle = "";
    }
    if (property === "borderStyle" && (!value || value === "none")) {
      this.borderWidth = "";
      this.borderColor = null;
      this.borderPosition = "";
    }
    if (property === "borderWidth" && value && !this.borderStyle) this.borderStyle = "solid";
    if (property === "borderStyle" && value && value !== "none" && !this.borderWidth) {
      this.borderWidth = "1px";
    }
    return true;
  }

  setImageLink(link) {
    this.link = link ?? "";
    if (!this.link) this.target = "_self";
    return true;
  }

  setImageLinkTarget(target) {
    if (!["_self", "_blank"].includes(target)) return false;
    this.target = target;
    return true;
  }

  setDisabled(disabled) {
    this.disabled = Boolean(disabled);
    return true;
  }

  setImages(images) {
    this.images = Array.isArray(images) ? images : [];
    return this;
  }

  #openPicker = () => {
    this.dispatchEvent(
      new CustomEvent("image-picker-open", {
        detail: {
          id: this.blockId,
          block: this,
          setImages: (images) => this.setImages(images),
        },
        bubbles: true,
        composed: true,
      }),
    );

    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector("dialog");
      if (!dialog?.open) dialog?.showModal();
    });
  };

  #closePicker = () => {
    this.renderRoot.querySelector("dialog")?.close();
  };

  #renderImageOption(image) {
    return html`
      <button type="button" class="image-option" @click=${() => this.#selectImage(image)}>
        <img src=${image.url} alt=${image.name} loading="lazy" />
        <span>${image.name}</span>
      </button>
    `;
  }

  #selectImage(image) {
    this.src = image.url;
    this.alt = image.name;
    this.#dispatchImageChange(image);
    this.#closePicker();
  }

  #dispatchImageChange(image = null) {
    this.dispatchEvent(
      new CustomEvent("image-change", {
        detail: { id: this.blockId, src: this.src, alt: this.alt, image },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("image-block", ImageBlock);

function toBorderWidthValue(width, position) {
  if (!width || !position) return width;

  const selected = new Set(String(position).split(/\s+/).filter(Boolean));
  const positions = ["top", "right", "bottom", "left"];
  if (!selected.size || positions.every((side) => selected.has(side))) return width;

  return positions.map((side) => (selected.has(side) ? width : "0")).join(" ");
}

const OBJECT_FIT_VALUES = new Set(["none", "contain", "cover", "fill", "scale-down"]);

function normalizeObjectFit(value) {
  return OBJECT_FIT_VALUES.has(value) ? value : "none";
}
