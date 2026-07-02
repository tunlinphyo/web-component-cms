import { PickerPopoverControl } from "./picker-popover-control.js";
import { fontSizeOptions } from "../../../customize/config/font-size.js";

export class FormatFontSize extends PickerPopoverControl {
  static configKey = "font-size";
  static options = fontSizeOptions;
  static command = "fontSize";
  static popoverId = "font-sizes";
  static title = "Font size";
  static fallbackLabel = "Default";
}

customElements.define("format-font-size", FormatFontSize);
