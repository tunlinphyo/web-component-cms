import { PickerPopoverControl } from "./picker-popover-control.js";
import { linkTargetOptions } from "../../../customize/config/link-target.js";

export class LinkTargetPickerControl extends PickerPopoverControl {
  static configKey = "link-target";
  static options = linkTargetOptions;
  static popoverId = "link-targets";
  static title = "Link target";

  constructor() {
    super();
    this.value = "_self";
  }
}
