import { GroupListBase } from "@/ui-editor";
import { PartnerNavButtonGroup } from "./partner-nav-button-group.js";

export class PartnerNavButtonListGroup extends GroupListBase {
  static itemTag = "partner-nav-button";
  static itemType = "partner-nav-button";
  static itemClass = PartnerNavButtonGroup;
  static defaultMin = 0;
  static defaultMax = 6;
  static defaultPrefix = "partner-nav";
  static defaultPlaceholder = "Nav";
  static defaultSortLabelBlock = "label";
}

PartnerNavButtonListGroup.define("partner-nav-button-list");
