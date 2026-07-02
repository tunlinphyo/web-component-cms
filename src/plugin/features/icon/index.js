import "../../components/blocks/icon/icon-block.js";
import "../../components/toolbars/controls/format-icon-background-color.js";
import { registerBlock } from "../../registries/block-registry.js";
import { FEATURES } from "../../registries/formatter-registry.js";

registerBlock({
  type: "icon",
  tagName: "icon-block",
  selector: "icon-block",
  text: false,
  formattable: true,
  capabilities: [
    FEATURES.align,
    FEATURES.fontSize,
    FEATURES.color,
    FEATURES.backgroundColor,
    FEATURES.link,
  ],
});
