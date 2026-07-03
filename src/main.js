import "./style.css";

import "./plugin/index.js";
import pageOne from "./assets/data/page-one.json";

const editor = document.querySelector("page-editor");
await editor.init(pageOne);
