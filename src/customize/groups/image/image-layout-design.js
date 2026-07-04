import { html } from "lit";
import { Layout } from "@/ui-editor";

export class ImageLayoutDesign extends Layout {
  static type = "image";

  renderDesign() {
    return html`<span class="media"></span>`;
  }
}

ImageLayoutDesign.define("layout-image");
