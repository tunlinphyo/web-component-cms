import { FormatAlign } from "./format-align";

export class FormatAlignJustify extends FormatAlign {
  command = "alignJustify";
  label = "Justify";
  icon = "☰";
}

customElements.define("format-align-justify", FormatAlignJustify);
