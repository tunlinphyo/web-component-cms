import { FormatAlign } from "./format-align";

export class FormatAlignRight extends FormatAlign {
  command = "alignRight";
  label = "Align right";
  icon = "⇥";
}

customElements.define("format-align-right", FormatAlignRight);
