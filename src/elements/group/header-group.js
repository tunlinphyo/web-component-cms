import { html } from "lit";
import { GroupBase } from "./group-base";
import { headerGroupStyles } from "./header-group.style.js";

export class HeaderGroup extends GroupBase {
  static styles = [GroupBase.styles, headerGroupStyles];

  render() {
    return html`
      <header data-group-box>
        <rich-text-block block-id="title" placeholder="Title" predefined-margin="0"></rich-text-block>
        <div class="container">
          <image-block block-id="logo" placeholder="Choose Logo"></image-block>
          <nav>
            <button-block block-id="nav-1" placeholder="Nav 1"></button-block>
            <button-block block-id="nav-2" placeholder="Nav 2"></button-block>
            <button-block block-id="nav-3" placeholder="Nav 3"></button-block>
            <button-block block-id="nav-4" placeholder="Nav 4"></button-block>
          </nav>
          <button-block block-id="button" placeholder="Hero button"></button-block>
        </div>
      </header>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("header-group", HeaderGroup);
