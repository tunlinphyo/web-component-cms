import "../../components/dialogs/confirm-dialog.js";
import "../../components/dialogs/group-picker-dialog.js";
import "../../components/groups/about/about-group.js";
import "../../components/groups/about-hokupay/about-hokupay-group.js";
import "../../components/groups/base/group-order.js";
import "../../components/groups/coming-soon/coming-soon-group.js";
import "../../components/groups/footer/footer-group.js";
import "../../components/groups/header/header-group.js";
import "../../components/groups/hero/hero-group.js";
import "../../components/groups/home-banner/home-banner-group.js";
import "../../components/groups/image/image-group.js";
import "../../components/groups/paragraph/paragraph-group.js";
import "../../components/toolbars/controls/border-radius-control.js";
import "../../components/toolbars/group-format-toolbar/group-style-color.js";
import "../../components/toolbars/group-format-toolbar/group-style-selector.js";
import { registerGroup } from "../../registries/group-registry.js";

for (const definition of [
  { type: "header", tagName: "header-group", selector: "header-group", label: "header" },
  {
    type: "home-banner",
    tagName: "home-banner-group",
    selector: "home-banner-group",
    label: "home-banner",
  },
  {
    type: "coming-soon",
    tagName: "coming-soon-group",
    selector: "coming-soon-group",
    label: "coming-soon",
  },
  {
    type: "about-hokupay",
    tagName: "about-hokupay-group",
    selector: "about-hokupay-group",
    label: "about-hokupay",
  },
  { type: "hero", tagName: "hero-group", selector: "hero-group", label: "hero", addable: false },
  { type: "about", tagName: "about-group", selector: "about-group", label: "about" },
  { type: "image", tagName: "image-group", selector: "image-group", label: "image" },
  {
    type: "paragraph",
    tagName: "paragraph-group",
    selector: "paragraph-group",
    label: "paragraph",
  },
  { type: "footer", tagName: "footer-group", selector: "footer-group", label: "footer" },
]) {
  registerGroup(definition);
}
