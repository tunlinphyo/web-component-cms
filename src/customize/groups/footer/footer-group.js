import { html } from "lit";
import { GroupBase } from "@/ui-editor";
import { emptyText } from "../shared/text-defaults.js";
import { footerGroupStyles } from "./footer-group.styles.js";

export class FooterGroup extends GroupBase {
  static styles = [GroupBase.styles, footerGroupStyles];

  static features = ["backgroundColor"];

  static defaultJson = {
    blocks: [
      {
        id: "logo",
        src: "",
        alt: "Hero Image",
        align: "start",
        borderRadius: "",
        objectFit: "contain",
        type: "image",
      },
      {
        id: "logo2",
        src: "",
        alt: "Hero Image",
        align: "start",
        borderRadius: "",
        objectFit: "contain",
        type: "image",
      },
      {
        id: "logo3",
        src: "",
        alt: "Hero Image",
        align: "start",
        borderRadius: "",
        objectFit: "contain",
        type: "image",
      },
      {
        id: "copyright",
        ...emptyText,
        textAlign: "left",
        fontWeight: "",
        fontSize: "",
        fontFamily: "var(--font-body)",
        type: "p",
      },
    ],
  };

  render() {
    return html`
      <footer data-group-box>
        <div class="logo-groups">
          <image-block
            block-id="logo"
            placeholder="Logo Image"
            features="objectFit,link,linkTarget"
          >
          </image-block>
          <image-block
            block-id="logo2"
            placeholder="Logo Image"
            features="objectFit,link,linkTarget"
          >
          </image-block>
          <image-block
            block-id="logo3"
            placeholder="Logo Image"
            features="objectFit,link,linkTarget"
          >
          </image-block>
        </div>
        <rich-text-block
          block-id="copyright"
          placeholder="Footer copyright"
          predefined-margin="0"
          features="fontFamily, fontSize, color, bold, italic"
        ></rich-text-block>
      </footer>
      ${this.renderSortControls()}
    `;
  }
}

FooterGroup.define("footer-group");
