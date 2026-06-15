import { html } from "lit";
import { GroupBase } from "./group-base";
import { footerGroupStyles } from "./footer-group.styles.js";

export class FooterGroup extends GroupBase {
  static styles = [GroupBase.styles, footerGroupStyles];

  static defaultJson = {
    blocks: [
      {
        "id": "logo",
        "src": "",
        "alt": "Hero Image",
        "maxWidth": "",
        "align": "start",
        "borderRadius": "",
        "type": "image"
      },
      {
        "id": "copyright",
        "value": "",
        "textAlign": "left",
        "fontWeight": "",
        "fontSize": "",
        "fontFamily": "var(--font-zen)",
        "type": "p"
      }
    ],
  };

  render() {
    return html`
      <footer data-group-box>
        <image-block block-id="logo" placeholder="Logo Image"></image-block>
        <rich-text-block block-id="copyright" placeholder="Footer copyright" predefined-margin="0"></rich-text-block>
      </footer>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("footer-group", FooterGroup);
