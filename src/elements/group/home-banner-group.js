import { html } from "lit";
// import messageIcon from "../../assets/svg/message.svg";
import { GroupBase } from "./group-base";
import { hostGroupStyles } from "./home-banner-group.style.js";

export class HomeBannerGroup extends GroupBase {
  static styles = [GroupBase.styles, hostGroupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "message",
        type: "p",
        value: "",
        textAlign: "center",
        fontWeight: "",
        fontSize: "",
        fontFamily: "var(--font-zen)",
        predefinedMargin: "0",
      },
      {
        id: "description",
        type: "p",
        value: "",
        textAlign: "left",
        fontWeight: "",
        fontSize: "",
        fontFamily: "var(--font-zen)",
        predefinedMargin: "1rem",
      },
      {
        id: "app-store",
        src: "",
        alt: "Hero Image",
        maxWidth: "",
        align: "end",
        link: "",
        target: "_self",
        backgroundColor: "",
        borderWidth: "",
        borderColor: "",
        borderStyle: "",
        borderRadius: "",
        type: "image",
      },
      {
        id: "play-store",
        src: "",
        alt: "Hero Image",
        maxWidth: "",
        align: "end",
        link: "",
        target: "_self",
        backgroundColor: "",
        borderWidth: "",
        borderColor: "",
        borderStyle: "",
        borderRadius: "",
        type: "image",
      },
      {
        id: "logo",
        src: "",
        alt: "Logo Image",
        maxWidth: "",
        align: "end",
        link: "",
        target: "_self",
        backgroundColor: "",
        borderWidth: "",
        borderColor: "",
        borderStyle: "",
        borderRadius: "",
        type: "image",
      },
      {
        id: "hero",
        src: "",
        alt: "Hero Image",
        maxWidth: "",
        align: "end",
        link: "",
        target: "_self",
        backgroundColor: "",
        borderWidth: "",
        borderColor: "",
        borderStyle: "",
        borderRadius: "",
        type: "image",
      },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        <div class="message">
          <rich-text-block block-id="message" placeholder="Message" predefined-margin="0"></rich-text-block>
        </div>
        <div class="content">
          <image-block block-id="logo" placeholder="Choose Logo"></image-block>
          <div class="store-links">
            <image-block block-id="app-store" placeholder="Choose Image"></image-block>
            <image-block block-id="play-store" placeholder="Choose Image"></image-block>
          </div>
          <rich-text-block
            block-id="description"
            placeholder="Description"
            predefined-margin="1rem"
          ></rich-text-block>
        </div>
        <div class="hero">
          <image-block block-id="hero" placeholder="Choose Image"></image-block>
        </div>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("home-banner-group", HomeBannerGroup);
