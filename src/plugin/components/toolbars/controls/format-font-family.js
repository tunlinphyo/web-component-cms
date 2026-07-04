import { PickerPopoverControl } from "./picker-popover-control.js";

export class FormatFontFamily extends PickerPopoverControl {
  static configKey = "font-family";
  static command = "fontFamily";
  static popoverId = "font-families";
  static title = "Font family";
  static fallbackLabel = "Font";
}

customElements.define("format-font-family", FormatFontFamily);
