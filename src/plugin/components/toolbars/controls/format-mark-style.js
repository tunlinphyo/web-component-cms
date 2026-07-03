import { PickerPopoverControl } from "./picker-popover-control.js";

export class FormatMarkStyle extends PickerPopoverControl {
  static configKey = "mark-style";
  static command = "markStyle";
  static popoverId = "mark-styles";
  static title = "Mark style";
  static fallbackLabel = "Default";
}

customElements.define("format-mark-style", FormatMarkStyle);
