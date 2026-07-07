import colors from "./colors.js";
import { fontFamilyOptions } from "./font-family.js";
import materialIconNames from "./material-icons.js";
import { registerConfig } from "@/ui-editor";

const CONFIG_OPTIONS = {
  colors,
  "font-family": fontFamilyOptions,
  "material-icons": materialIconNames,
};

registerConfig(CONFIG_OPTIONS);
