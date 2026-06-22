import "../../components/blocks/button/button-block.js";
import "../../components/toolbars/controls/format-button-design.js";
import "../../components/toolbars/controls/format-button-icon-placement.js";
import "../../components/toolbars/controls/format-button-link-target.js";
import "../../components/toolbars/controls/format-button-link.js";
import "../../components/toolbars/controls/format-disabled.js";
import { registerBlock } from "../../registries/block-registry.js";
import { registerCommand } from "../../registries/command-registry.js";
import { FEATURES } from "../../registries/formatter-registry.js";

registerBlock({
  type: "button",
  tagName: "button-block",
  selector: "button-block",
  text: false,
  formattable: true,
  capabilities: [
    FEATURES.align,
    FEATURES.buttonDesign,
    FEATURES.icon,
    FEATURES.link,
    FEATURES.linkTarget,
    FEATURES.disabled,
  ],
});

for (const definition of [
  { command: "buttonDesign", feature: FEATURES.buttonDesign },
  { command: "buttonIconPlacement", feature: FEATURES.icon },
  { command: "buttonLink", feature: FEATURES.link },
  { command: "buttonLinkTarget", feature: FEATURES.linkTarget },
  { command: "disabled", feature: FEATURES.disabled },
]) {
  registerCommand(definition);
}
