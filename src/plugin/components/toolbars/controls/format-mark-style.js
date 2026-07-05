import { css, html } from "lit";
import { markStyles } from "../../blocks/text/mark.styles.js";
import { PickerPopoverControl } from "./picker-popover-control.js";

export class FormatMarkStyle extends PickerPopoverControl {
  static configKey = "mark-style";
  static command = "markStyle";
  static popoverId = "mark-styles";
  static title = "Mark style";
  static fallbackLabel = "Default";
  static styles = [
    PickerPopoverControl.styles,
    markStyles,
    css`
      mark {
        font-size: 0.75rem;
        line-height: 1;
      }
    `,
  ];

  renderTriggerLabel(option) {
    return this.#renderLabel(option);
  }

  renderOptionLabel(option) {
    return this.#renderLabel(option);
  }

  #renderLabel(option) {
    return html`<mark class=${option?.value ?? ""}>
      ${option?.label ?? this.constructor.fallbackLabel}
    </mark>`;
  }
}

customElements.define("format-mark-style", FormatMarkStyle);
