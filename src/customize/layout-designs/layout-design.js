import { LitElement, html } from "lit";
import { layoutDesignStyles } from "./layout-design.styles.js";

export class LayoutDesign extends LitElement {
  static styles = layoutDesignStyles;

  render() {
    const type = this.localName.replace(/^layout-/, "");
    return html`<div class="canvas" role="img" aria-label=${`${type} layout preview`}>
      ${renderDesign(type)}
    </div>`;
  }
}

function renderDesign(type) {
  if (type === "header") {
    return html`
      <div class="row">
        <span class="logo"></span>
        <span class="spacer"></span>
        <span class="row">
          <span class="nav-button"></span>
          <span class="nav-button"></span>
          <span class="nav-button"></span>
          <span class="nav-button"></span>
        </span>
        <span class="button"></span>
      </div>
    `;
  }

  if (type === "footer") {
    return html`
      <div class="row">
        <div class="row baseline">
          <span class="logo"></span>
          <span class="logo"></span>
          <span class="logo"></span>
          <span class="spacer"></span>
          <span class="line" style="width: 6rem"></span>
        </div>
      </div>
    `;
  }

  // if (type === "footer") {
  //   return html`
  //     <div class="columns">
  //       ${Array.from(
  //         { length: 3 },
  //         () => html`<div class="stack"><span class="title"></span><span class="line"></span><span class="line medium"></span></div>`,
  //       )}
  //     </div>
  //   `;
  // }

  if (type === "home-news") {
    return html`
      <span class="title"></span>
      ${Array.from(
        { length: 2 },
        () => html`<div class="card" style="min-height: 0;">
          <div class="row grow">
            <span class="title" style="width: 4rem"></span>
            <span class="cols grow">
              <span class="line short"></span>
              <span class="line"></span>
            </span>
          </div>
        </div>`,
      )}
    `;
  }

  if (type === "about") {
    return html`
      <div class="stack">
        <span class="title"></span>
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
        <span class="line medium"></span>
      </div>
    `;
  }

  if (type === "image" || type === "hero") {
    return html`<span class="media"></span>`;
  }

  if (type === "news") {
    return html`
      <div class="row"><span class="circle"></span><span class="title"></span></div>
      <span class="line"></span><span class="line"></span><span class="line medium"></span>
    `;
  }

  if (type === "table") {
    return html`
      <span class="title"></span>
      <div class="stack">
        <span class="line"></span>
        <span class="line medium"></span>
      </div>
      <div class="table-preview">
        ${Array.from({ length: 9 }, () => html`<span class="table-cell"></span>`)}
      </div>
    `;
  }

  return html`
    <span class="title"></span>
    <span class="line"></span>
    <span class="line"></span>
    <span class="line medium"></span>
  `;
}
