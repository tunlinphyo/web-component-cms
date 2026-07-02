import { listGroupDefinitions } from "../../plugin/index.js";
import { GroupPickerDialog } from "./group-picker-dialog.js";

const ALLOWED_GROUP_TYPES = new Set(["home-news"]);

export class HomeGroupPickerDialog extends GroupPickerDialog {
  get groups() {
    return listGroupDefinitions().filter((definition) => ALLOWED_GROUP_TYPES.has(definition.type));
  }
}

customElements.define("home-group-picker-dialog", HomeGroupPickerDialog);
