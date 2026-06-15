import { html } from "lit";
import { GroupBase } from "./group-base.js";
import { hostGroupStyles } from "./coming-soon-group.style.js";

export class GroupComingSoon extends GroupBase {
  static styles = [GroupBase.styles, hostGroupStyles];

  static defaultJson = {
    blocks: [
      {
        "id": "icon",
        "icon": "gift",
        "fontSize": "24px",
        "color": "#fff",
        "link": "",
        "align": "left",
        "type": "icon"
      },
      {
        "id": "description",
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
      <div data-group-box>
        <icon-block block-id="icon"></icon-block>
        <rich-text-block block-id="description" placeholder="Description"></rich-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("coming-soon-group", GroupComingSoon);
