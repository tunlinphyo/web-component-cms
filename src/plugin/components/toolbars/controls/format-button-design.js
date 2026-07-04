import { PickerPopoverControl } from "./picker-popover-control.js";
import { pickerPopoverControlStyles } from "./picker-popover-control.styles.js";

export class FormatButtonDesign extends PickerPopoverControl {
  static configKey = "button-design";
  static styles = pickerPopoverControlStyles;
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
