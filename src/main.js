import "./style.css";

import "./features/index.js";
import "./editor/rich-text-editor.js";

import pageDataUrl from "./assets/data/page-one.json?url";

window.addEventListener("load", () => {
  void initEditor();
});

async function initEditor() {
  const response = await fetch(pageDataUrl);
  const pageData = await response.json();

  document.querySelector("rich-text-editor")?.init(pageData);
}
