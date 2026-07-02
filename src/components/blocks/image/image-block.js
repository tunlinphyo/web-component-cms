import { LitElement, html } from "lit";
import { imageBlockStyles } from "./image-block.styles.js";
import {
  getCapabilities,
  toFeatureAttribute,
} from "../../../registries/formatter-registry.js";

const DEFAULT_IMAGE_RESPONSE = {
  ok: true,
  count: 2,
  images: [
    {
      originalName: "img_hero_pc01.jpeg",
      createdAt: "2026-06-23T03:09:33.395Z",
      id: "0fcecf4f-6a6a-4a24-9be6-19bffee5d3da",
      filename: "0fcecf4f-6a6a-4a24-9be6-19bffee5d3da.jpeg",
      mimeType: "image/jpeg",
      size: 149369,
    },
    {
      originalName: "img_hero_pc01.jpeg",
      createdAt: "2026-06-23T03:09:22.889Z",
      id: "9626e386-74db-4d86-84a1-a66de682e55a",
      filename: "9626e386-74db-4d86-84a1-a66de682e55a.jpeg",
      mimeType: "image/jpeg",
      size: 149369,
    },
  ],
};

export class ImageBlock extends LitElement {
  static properties = {
    blockId: { type: String, attribute: "block-id", reflect: true },
    src: { type: String },
    alt: { type: String },
    images: { attribute: false },
    imageBaseUrl: { type: String, attribute: "image-base-url" },
    pickerOpen: { type: Boolean, state: true },
    accept: { type: String },
    placeholder: { type: String },
    maxSize: { type: Number, attribute: "max-size", reflect: true },
    maxWidth: { type: String, attribute: "max-width", reflect: true },
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
    this.images = DEFAULT_IMAGE_RESPONSE.images;
    this.imageBaseUrl = "/uploads/";
    this.pickerOpen = false;
    this.accept = "image/*";
    this.placeholder = "Choose image";
    this.maxSize = 0;
    this.maxWidth = "100%";
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
      maxWidth = "100%",
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
    this.maxWidth = maxWidth;
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
      maxWidth: this.maxWidth,
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
        style=${`max-width: ${this.maxWidth}; vertical-align: top; background-color: ${this.backgroundColor}; border-width: ${toBorderWidthValue(this.borderWidth, this.borderPosition)}; border-color: ${this.borderColor}; border-style: ${this.borderStyle}; border-radius: ${this.borderRadius};`}
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
      <dialog @close=${this.#dialogClose}>
        <div class="dialog-header">
          <strong>Choose image</strong>
          <button type="button" aria-label="Close image picker" @click=${this.#closePicker}>
            &#10005;
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

  setImages(responseOrImages) {
    this.images = normalizeImages(responseOrImages);
    return this;
  }

  #openPicker = () => {
    this.dispatchEvent(
      new CustomEvent("image-picker-open", {
        detail: {
          id: this.blockId,
          block: this,
          setImages: (responseOrImages) => this.setImages(responseOrImages),
          setImageBaseUrl: (imageBaseUrl) => {
            this.imageBaseUrl = imageBaseUrl;
          },
        },
        bubbles: true,
        composed: true,
      }),
    );

    this.pickerOpen = true;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector("dialog");
      if (!dialog?.open) dialog?.showModal();
    });
  };

  #closePicker = () => {
    this.renderRoot.querySelector("dialog")?.close();
  };

  #dialogClose = () => {
    this.pickerOpen = false;
  };

  #renderImageOption(image) {
    const src = resolveImageUrl(image, this.imageBaseUrl);
    const label = image.originalName || image.filename || image.id || src;

    return html`
      <button type="button" class="image-option" @click=${() => this.#selectImage(image)}>
        <img src=${src} alt=${label} loading="lazy" />
        <span>${label}</span>
      </button>
    `;
  }

  #selectImage(image) {
    this.src = resolveImageUrl(image, this.imageBaseUrl);
    this.alt = image.originalName || image.filename || image.id || "";
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

function normalizeImages(responseOrImages) {
  if (Array.isArray(responseOrImages)) return responseOrImages;
  if (Array.isArray(responseOrImages?.images)) return responseOrImages.images;
  return [];
}

function resolveImageUrl(image, imageBaseUrl = "") {
  const path = image.url || image.path || image.src || image.id || image.filename || "";
  if (!path || path.match(/^(data:|blob:|https?:\/\/|\/)/)) return path;
  if (!imageBaseUrl) return path;

  return `${imageBaseUrl.replace(/\/$/, "")}/${path}`;
}

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
