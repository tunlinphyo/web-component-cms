import "../../components/blocks/quill-text/quill-text-block.js";
import { registerBlock } from "../../registries/block-registry.js";
import { FEATURES } from "../../registries/formatter-registry.js";

registerBlock({
  type: "quill-text",
  tagName: "quill-text-block",
  selector: "quill-text-block",
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
