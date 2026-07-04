import { GroupPickerDialog } from "@/ui-editor";

export class PartnerGroupPicker extends GroupPickerDialog {
  static groupTypes = new Set(["home-news", "table"]);
}

PartnerGroupPicker.define("partner-group-picker-dialog");
