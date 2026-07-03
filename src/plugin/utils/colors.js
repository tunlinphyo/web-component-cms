import colors from "../../customize/config/colors.js";

export const DEFAULT_TEXT_COLOR = "#000000";
export const DEFAULT_BACKGROUND_COLOR = "#ffffff";
export const COLOR_WHEEL_GRADIENT =
  "conic-gradient(#ff3b30, #ff9500, #ffcc00, #34c759, #00c7be, #007aff, #5856d6, #af52de, #ff2d55, #ff3b30)";

export const EDITOR_COLORS = colors.map((color, index) => {
  if (color === "") {
    return {
      spacer: true,
      id: `color-spacer-${index}`,
    };
  }

  if (typeof color === "string") {
    return {
      label: `Color ${index + 1}`,
      value: color,
    };
  }

  return color;
});

export const EDITOR_COLOR_SWATCHES = EDITOR_COLORS;
export const EDITOR_COLOR_SWATCHES_WITH_UNSET = EDITOR_COLORS;
