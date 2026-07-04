import { borderPositionOptions } from "./border-position.js";
import { borderRadiusOptions } from "./border-radius.js";
import { borderStyleOptions } from "./border-style.js";
import { borderWidthOptions } from "./border-width.js";
import { buttonDesignOptions } from "./button-design.js";
import { buttonIconPlacementOptions } from "./button-icon-placement.js";
import colors from "./colors.js";
import { elementTypeOptions } from "./element-type.js";
import { fontFamilyOptions } from "./font-family.js";
import { fontSizeOptions } from "./font-size.js";
import { iconOptions } from "./icons.js";
import { linkTargetOptions } from "./link-target.js";
import { markStyleOptions } from "./mark-style.js";
import materialIconNames from "./material-icons.js";
import { objectFitOptions } from "./object-fit.js";
import { registerConfig } from "@/ui-editor";

const CONFIG_OPTIONS = {
  "border-position": borderPositionOptions,
  "border-radius": borderRadiusOptions,
  "border-style": borderStyleOptions,
  "border-width": borderWidthOptions,
  "button-design": buttonDesignOptions,
  "button-icon-placement": buttonIconPlacementOptions,
  colors,
  "element-type": elementTypeOptions,
  "font-family": fontFamilyOptions,
  "font-size": fontSizeOptions,
  icons: iconOptions,
  "link-target": linkTargetOptions,
  "mark-style": markStyleOptions,
  "material-icons": materialIconNames,
  "object-fit": objectFitOptions,
};

registerConfig(CONFIG_OPTIONS);
