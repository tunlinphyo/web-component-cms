import "../../components/blocks/rich-text/rich-text-block.js";
import "../../components/toolbars/controls/element-type-selector.js";
import "../../components/toolbars/controls/format-align-center.js";
import "../../components/toolbars/controls/format-align-justify.js";
import "../../components/toolbars/controls/format-align-left.js";
import "../../components/toolbars/controls/format-align-right.js";
import "../../components/toolbars/controls/format-bold.js";
import "../../components/toolbars/controls/format-font-family.js";
import "../../components/toolbars/controls/format-font-size.js";
import "../../components/toolbars/controls/format-highlight.js";
import "../../components/toolbars/controls/format-italic.js";
import "../../components/toolbars/controls/format-link.js";
import "../../components/toolbars/controls/format-link-target.js";
import "../../components/toolbars/controls/format-mark-style.js";
import "../../components/toolbars/controls/format-ordered-list.js";
import "../../components/toolbars/controls/format-text-color-palette.js";
import "../../components/toolbars/controls/format-text-color.js";
import "../../components/toolbars/controls/format-underline.js";
import "../../components/toolbars/controls/format-unordered-list.js";
import { registerBlock } from "../../registries/block-registry.js";
import { registerCommand } from "../../registries/command-registry.js";
import { FEATURES } from "../../registries/formatter-registry.js";

registerBlock({
  type: "text",
  tagName: "rich-text-block",
  selector: "rich-text-block",
  text: true,
  formattable: true,
  schemaTypes: ["p", "h1", "h2", "h3"],
  capabilities: [
    FEATURES.type,
    FEATURES.fontFamily,
    FEATURES.fontSize,
    FEATURES.color,
    FEATURES.bold,
    FEATURES.italic,
    FEATURES.underline,
    FEATURES.orderedList,
    FEATURES.unorderedList,
    FEATURES.align,
    FEATURES.backgroundColor,
    FEATURES.link,
    FEATURES.linkTarget,
  ],
});

for (const definition of [
  { command: "fontFamily", feature: FEATURES.fontFamily },
  { command: "fontSize", feature: FEATURES.fontSize },
  { command: "foreColor", feature: FEATURES.color },
  { command: "backgroundColor", feature: FEATURES.backgroundColor },
  { command: "bold", feature: FEATURES.bold },
  { command: "italic", feature: FEATURES.italic },
  { command: "underline", feature: FEATURES.underline },
  { command: "insertOrderedList", feature: FEATURES.orderedList },
  { command: "insertUnorderedList", feature: FEATURES.unorderedList },
  { command: "highlight", feature: FEATURES.backgroundColor },
  { command: "markStyle", feature: FEATURES.backgroundColor },
  { command: "link", feature: FEATURES.link },
  { command: "linkTarget", feature: FEATURES.linkTarget },
  { command: "linkEdit", feature: FEATURES.link },
  { command: "linkCancel", feature: FEATURES.link },
]) {
  registerCommand(definition);
}
