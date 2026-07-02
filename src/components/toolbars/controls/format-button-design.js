import { PickerPopoverControl } from "./picker-popover-control.js";
import { formatButtonDesignStyles } from "./format-button-design.styles.js";
import { pickerPopoverControlStyles } from "./picker-popover-control.styles.js";
import { buttonDesignOptions } from "../../../customize/config/button-design.js";

export class FormatButtonDesign extends PickerPopoverControl {
  static configKey = "button-design";
  static styles = [pickerPopoverControlStyles, formatButtonDesignStyles];
  static options = buttonDesignOptions;
  static command = "buttonDesign";
  static popoverId = "button-designs";
  static title = "Button design";
  static fallbackLabel = "Button design";

  constructor() {
    super();
    this.value = "primary";
  }
}

customElements.define("format-button-design", FormatButtonDesign);
