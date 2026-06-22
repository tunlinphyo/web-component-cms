import { html } from "lit";
import { GroupBase } from "../base/group-base.js";
import { hostGroupStyles } from "./about-hokupay-group.style.js";

export class AboutHokupayGroup extends GroupBase {
  static styles = [GroupBase.styles, hostGroupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "hero",
        src: "",
        alt: "Hero Image",
        maxWidth: "",
        align: "end",
        borderRadius: "",
        type: "image",
      },
      {
        id: "title",
        type: "h2",
        value: "",
        textAlign: "left",
        fontWeight: "",
      },
      {
        id: "description",
        type: "p",
        value: "",
        textAlign: "left",
        fontWeight: "",
      },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        <div class="title">
          <rich-text-block
            block-id="title"
            placeholder="Title"
            predefined-margin="0"
            features="type,fontSize,color,bold,italic,underline"
          ></rich-text-block>
          <svg width="90" viewBox="0 0 112 43" fill="none">
            <path
              d="M110.027 13.4575C94.0458 9.3945 79.9741 20.8726 77.0704 35.877C76.6958 37.2917 77.0128 38.574 78.7348 38.6019C82.3014 38.7483 85.94 38.351 89.384 37.5078L89.557 37.466C98.0879 35.3125 103.974 31.1102 109.141 25.3607C111.943 22.35 108.751 22.0294 106.122 20.7611C105.524 20.4684 105.365 20.1199 105.372 19.876C105.394 18.7331 109.371 17.7783 111.475 15.7921C111.648 15.6318 111.951 15.3182 111.929 14.9349C111.886 14.1474 110.524 13.5829 110.034 13.4575H110.027Z"
              fill="#E1006E"
            />
            <path
              d="M48.4483 12.0367C51.2797 28.2812 67.5105 36.4249 82.3896 32.9353C83.8337 32.6983 84.8741 31.8844 84.195 30.3017C82.8692 26.9874 81.018 23.8299 78.8395 21.0323L78.7305 20.8916C73.2752 13.9886 67.0321 10.3366 59.6722 7.97515C55.7783 6.64949 56.7918 9.69314 56.7104 12.6118C56.6881 13.2772 56.435 13.5644 56.2094 13.6576C55.1577 14.1056 52.6592 10.8671 49.9861 9.76001C49.7691 9.6678 49.3591 9.51999 49.0182 9.69654C48.3173 10.0582 48.3594 11.5317 48.4454 12.0301L48.4483 12.0367Z"
              fill="#F096B9"
            />
            <path
              d="M2.93011 34.7012C19.0638 38.1079 32.6548 26.0646 34.9431 10.954C35.2596 9.5252 34.8905 8.2569 33.1687 8.2994C29.5992 8.29888 25.9799 8.84443 22.5731 9.82768L22.402 9.87653C13.9662 12.3767 8.25623 16.816 3.32933 22.7718C0.651859 25.8944 3.85417 26.0843 6.53367 27.2442C7.14316 27.5122 7.31578 27.8539 7.31854 28.0979C7.34364 29.2408 3.40871 30.3572 1.38771 32.4277C1.22148 32.5949 0.931928 32.9206 0.969183 33.3027C1.04455 34.0878 2.42825 34.5962 2.92291 34.7015L2.93011 34.7012Z"
              fill="#EB6EA0"
            />
          </svg>
        </div>
        <div class="description-group">
          <rich-text-block
            block-id="description"
            placeholder="Description"
            predefined-margin="1rem"
          ></rich-text-block>
          <image-block block-id="hero" placeholder="Choose Image"></image-block>
        </div>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("about-hokupay-group", AboutHokupayGroup);
