import "./style.css";

import "./elements/format/format-controls";
import "./elements/block/blocks";
import "./elements/group/header-group";
import "./elements/group/hero-group";
import "./elements/group/about-group";
import "./elements/group/image-group";
import "./elements/group/paragraph-group";
import "./elements/group/footer-group";
import "./elements/group/group-picker-dialog";
import "./elements/group/group-order";
import "./elements/rich-text-editor";
import "./elements/editor-output-button";

import heroImage from "./assets/hero.png";

import pageData from "./assets/data/page-one.json";

window.addEventListener("load", () => {
  document.querySelector("rich-text-editor")?.init(pageData);
});
