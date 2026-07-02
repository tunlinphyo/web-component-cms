import { svg } from "lit";
import { FormatAlign } from "./format-align";

export class FormatAlignJustify extends FormatAlign {
  command = "alignJustify";
  label = "Justify";
  icon = svg`
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        d="M4 5h16M4 9h16M4 13h16M4 17h16M4 21h16"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      />
    </svg>
  `;
}

customElements.define("format-align-justify", FormatAlignJustify);
