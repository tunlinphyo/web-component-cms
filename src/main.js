import "./style.css";

import "@/ui-editor";
import "./components/json-diaplay.js";
import "./customize/index.js";
import pageOne from "./assets/data/page-one.json";

const images = [
  { name: "logo-h.png", url: "/images/logo-h.png" },
  { name: "logo-v.png", url: "/images/logo-v.png" },
  { name: "beyond.png", url: "/images/beyond.png" },
  { name: "kita-city.png", url: "/images/kita-city.png" },
  { name: "app.png", url: "/images/app.png" },
  { name: "benefit-1.png", url: "/images/benefit-1.png" },
  { name: "benefit-2.png", url: "/images/benefit-2.png" },
  { name: "benefit-3.png", url: "/images/benefit-3.png" },
  { name: "benefit-4.png", url: "/images/benefit-4.png" },
  { name: "hokupay2.jpg", url: "/images/hokupay2.jpg" },
  { name: "inspire-1.png", url: "/images/inspire-1.png" },
  { name: "inspire-2.png", url: "/images/inspire-2.png" },
  { name: "inspire-3.png", url: "/images/inspire-3.png" },
  { name: "process-2.png", url: "/images/process-2.png" },
  { name: "process.png", url: "/images/process.png" },
  { name: "usage-1.png", url: "/images/usage-1.png" },
  { name: "usage-2.png", url: "/images/usage-2.png" },
  { name: "usage-3.png", url: "/images/usage-3.png" },
];

const editor = document.querySelector("rich-text-editor");
const logDataButton = document.querySelector("#log-data");
const jsonDisplay = document.querySelector("json-display");

editor.addEventListener("image-picker-open", (event) => {
  event.detail.setImages(images);
});
logDataButton.addEventListener("click", () => {
  void jsonDisplay.open(editor.toJSON());
});
await editor.init(pageOne);
