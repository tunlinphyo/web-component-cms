import { listGroupDefinitions } from "../../plugin/index.js";
import { GroupPickerDialog } from "./group-picker-dialog.js";

const ALLOWED_GROUP_TYPES = new Set(["home-news", "table"]);

export class PartnerGroupPicker extends GroupPickerDialog {
  get groups() {
    return listGroupDefinitions().filter((definition) => ALLOWED_GROUP_TYPES.has(definition.type));
  }
}

customElements.define("partner-group-picker-dialog", PartnerGroupPicker);
