import { borderPositionOptions } from "./border-position.js";
import { borderRadiusOptions } from "./border-radius.js";
import { borderStyleOptions } from "./border-style.js";
import { borderWidthOptions } from "./border-width.js";
import { buttonDesignOptions } from "./button-design.js";
import { buttonIconPlacementOptions } from "./button-icon-placement.js";
import { elementTypeOptions } from "./element-type.js";
import { fontFamilyOptions } from "./font-family.js";
import { fontSizeOptions } from "./font-size.js";
import { iconOptions } from "./icons.js";
import { linkTargetOptions } from "./link-target.js";
import { markStyleOptions } from "./mark-style.js";
import { objectFitOptions } from "./object-fit.js";

const CONFIG_OPTIONS = {
  "border-position": borderPositionOptions,
  "border-radius": borderRadiusOptions,
  "border-style": borderStyleOptions,
  "border-width": borderWidthOptions,
  "button-design": buttonDesignOptions,
  "button-icon-placement": buttonIconPlacementOptions,
  "element-type": elementTypeOptions,
  "font-family": fontFamilyOptions,
  "font-size": fontSizeOptions,
  icons: iconOptions,
  "link-target": linkTargetOptions,
  "mark-style": markStyleOptions,
  "object-fit": objectFitOptions,
};

export function resolveConfigOptions(key, fallback = []) {
  return CONFIG_OPTIONS[key] ?? fallback;
}
