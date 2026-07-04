import { BlockListGroup } from "@/ui-editor";

export class NavButtonGroup extends BlockListGroup {
  get prefix() {
    return this.getAttribute("prefix") || "nav";
  }

  get placeholder() {
    return this.getAttribute("placeholder") || "Nav";
  }

  get itemLabel() {
    return this.getAttribute("item-label") || "Nav item";
  }

  get defaultDesign() {
    return this.getAttribute("default-design") || "nav";
  }

  createBlockData(id) {
    return {
      ...super.createBlockData(id),
      icon: "home",
      iconPosition: "start",
    };
  }
}

NavButtonGroup.define("nav-button-group", { type: "header-nav" });
