import { PickerPopoverControl } from "./picker-popover-control.js";
import { fontFamilyOptions } from "../../../customize/config/font-family.js";

export class FormatFontFamily extends PickerPopoverControl {
  static configKey = "font-family";
  static options = fontFamilyOptions;
  static command = "fontFamily";
  static popoverId = "font-families";
  static title = "Font family";
  static fallbackLabel = "Font";
}

customElements.define("format-font-family", FormatFontFamily);
