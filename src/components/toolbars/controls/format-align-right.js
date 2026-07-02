import { svg } from "lit";
import { FormatAlign } from "./format-align";

export class FormatAlignRight extends FormatAlign {
  command = "alignRight";
  label = "Align right";
  icon = svg`
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        d="M4 5h16M10 9h10M4 13h16M10 17h10M4 21h16"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      />
    </svg>
  `;
}

customElements.define("format-align-right", FormatAlignRight);
