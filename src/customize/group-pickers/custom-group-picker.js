import { listGroupDefinitions } from "../../plugin/index.js";
import { GroupPickerDialog } from "./group-picker-dialog.js";

const ALLOWED_GROUP_TYPES = new Set(["header", "hero", "home-news", "about", "image", "table", "footer"]);

export class CustomGroupPicker extends GroupPickerDialog {
  get groups() {
    return listGroupDefinitions().filter((definition) => ALLOWED_GROUP_TYPES.has(definition.type));
  }
}

customElements.define("custom-group-picker-dialog", CustomGroupPicker);
