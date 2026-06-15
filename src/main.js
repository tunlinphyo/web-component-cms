import "./style.css";

import "./elements/format/format-controls";
import "./elements/block/blocks";
import "./elements/group/index.js";
import "./elements/utils/confirm-dialog";
import "./elements/rich-text-editor";
import "./elements/editor-output-button";

import heroImage from "./assets/hero.png";

import pageData from "./assets/data/page-one.json";

window.addEventListener("load", () => {
  document.querySelector("rich-text-editor")?.init(pageData);
});
