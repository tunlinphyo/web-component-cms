import { GroupPickerDialog } from "@/ui-editor";

export class HomeGroupPickerDialog extends GroupPickerDialog {
  static groupTypes = new Set(["home-news"]);
}

HomeGroupPickerDialog.define("home-group-picker-dialog");
