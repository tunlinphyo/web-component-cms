import "../../components/lists/block-list/block-list-group.js";
import "../../components/toolbars/controls/block-list-filter.js";
import "../../components/toolbars/controls/sort-list-control.js";
import { registerList } from "../../registries/list-registry.js";

registerList({
  type: "block-list",
  tagName: "block-list-group",
  selector: "block-list-group",
});
