import { GroupPickerDialog } from "@/ui-editor";

export class CustomGroupPicker extends GroupPickerDialog {
  static groupTypes = new Set(["header", "hero", "home-news", "about", "image", "table", "footer"]);
}

CustomGroupPicker.define("custom-group-picker-dialog");
