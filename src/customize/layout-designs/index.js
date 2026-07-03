import { LayoutDesign } from "./layout-design.js";

const GROUP_LAYOUT_TYPES = [
  "header",
  "home-news",
  "hero",
  "about",
  "image",
  "news",
  "paragraph",
  "quill-test",
  "table",
  "footer",
];

for (const type of GROUP_LAYOUT_TYPES) {
  const tagName = `layout-${type}`;
  if (!customElements.get(tagName)) customElements.define(tagName, class extends LayoutDesign {});
}
