import { html } from "lit";
import { GroupBase } from "../../../plugin/index.js";
import "./nav-button-group.js";
import { headerGroupStyles } from "./header-group.style.js";

export class HeaderGroup extends GroupBase {
  static styles = [GroupBase.styles, headerGroupStyles];

  static defaultJson = {
    blocks: [
      {
        id: "title",
        type: "p",
        value: "",
        textAlign: "left",
      },
      {
        id: "logo",
        type: "image",
        src: "",
        alt: "",
      },
      {
        id: "navs",
        type: "navs",
        children: [
          createDefaultNav("nav-1", 0),
          createDefaultNav("nav-2", 1),
          createDefaultNav("nav-3", 2),
          createDefaultNav("nav-4", 3),
        ],
      },
      {
        id: "button",
        type: "button",
        text: "",
      },
    ],
  };

  render() {
    return html`
      <header data-group-box>
        <rich-text-block
          block-id="title"
          placeholder="Title"
          predefined-margin="0"
        ></rich-text-block>
        <div class="container">
          <image-block block-id="logo" placeholder="Choose Logo"></image-block>
          <nav>
            <nav-button-group
              block-id="navs"
              block-type="navs"
              min="0"
              max="6"
              prefix="nav"
              placeholder="Nav"
              default-design="nav"
            >
              <button-block placeholder="Nav 1"></button-block>
              <button-block placeholder="Nav 2"></button-block>
              <button-block placeholder="Nav 3"></button-block>
              <button-block placeholder="Nav 4"></button-block>
            </nav-button-group>
          </nav>
          <button-block block-id="button" placeholder="Hero button"></button-block>
        </div>
      </header>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("header-group", HeaderGroup);

function createDefaultNav(id, sort) {
  return {
    id,
    type: "button",
    sort,
    text: "",
    design: "nav",
    icon: "home",
    iconPosition: "start",
    link: "",
  };
}
