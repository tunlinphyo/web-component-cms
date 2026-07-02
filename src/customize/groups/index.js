import "./about/about-group.js";
import "./footer/footer-group.js";
import "./header/header-group.js";
import "./hero/hero-group.js";
import "./home-news/home-news-group.js";
import "./image/image-group.js";
import "./news/news-group.js";
import "./paragraph/paragraph-group.js";
import "./table/table-group.js";
import { registerGroup } from "../../registries/group-registry.js";
import { registerList } from "../../registries/list-registry.js";

registerList({
  type: "news-list",
  tagName: "news-list-group",
  selector: "news-list-group",
});

for (const definition of [
  { type: "header", tagName: "header-group", selector: "header-group", label: "header" },
  {
    type: "home-news",
    tagName: "home-news-group",
    selector: "home-news-group",
    label: "home-news",
  },
  {
    type: "hero",
    tagName: "hero-group",
    selector: "hero-group",
    label: "hero",
    addable: false,
  },
  { type: "about", tagName: "about-group", selector: "about-group", label: "about" },
  { type: "image", tagName: "image-group", selector: "image-group", label: "image" },
  { type: "news", tagName: "news-group", selector: "news-group", label: "news" },
  {
    type: "paragraph",
    tagName: "paragraph-group",
    selector: "paragraph-group",
    label: "paragraph",
  },
  { type: "table", tagName: "table-group", selector: "table-group", label: "table" },
  { type: "footer", tagName: "footer-group", selector: "footer-group", label: "footer" },
]) {
  registerGroup(definition);
}
