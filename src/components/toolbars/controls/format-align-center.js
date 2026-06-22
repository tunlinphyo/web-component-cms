import { FormatAlign } from "./format-align";

export class FormatAlignCenter extends FormatAlign {
  command = "alignCenter";
  label = "Align center";
  icon = "↔";
}

customElements.define("format-align-center", FormatAlignCenter);
