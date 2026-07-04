import { GroupPickerDialog } from "@/ui-editor";

export class HeaderFooterGroupPickerDialog extends GroupPickerDialog {
  static groupTypes = new Set(["header", "footer"]);
}

HeaderFooterGroupPickerDialog.define("header-footer-group-picker-dialog");
