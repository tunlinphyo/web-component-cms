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

  createBlockData(id) {
    return {
      id,
      color: "var(--brand-900)",
      backgroundColor: "transparent",
      icon: "home",
      iconPosition: "start",
      iconColor: "var(--white)",
      iconBackgroundColor: "var(--brand-500)",
      iconBorderRadius: "999px",
    };
  }
}

NavButtonGroup.define("nav-button-group", { type: "header-nav" });
