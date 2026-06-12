import { FormatColor } from "./format-color";

export class FormatTextColor extends FormatColor {
  command = "foreColor";
  label = "Color";

  constructor() {
    super();
    this.value = "#000000";
  }
}

customElements.define("format-text-color", FormatTextColor);
