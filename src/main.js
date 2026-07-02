import "./style.css";

import "./features/index.js";
import "./editor/rich-text-editor.js";
import pageOne from "./assets/data/page-one.json";

const editor = document.querySelector("rich-text-editor");
editor.init(pageOne);
