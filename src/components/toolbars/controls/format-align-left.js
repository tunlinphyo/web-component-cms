import { FormatAlign } from "./format-align";

export class FormatAlignLeft extends FormatAlign {
  command = "alignLeft";
  label = "Align left";
  icon = "⇤";
}

customElements.define("format-align-left", FormatAlignLeft);
