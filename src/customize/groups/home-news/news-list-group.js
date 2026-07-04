import { GroupListBase } from "@/ui-editor";
import { NewsGroup } from "../news/news-group.js";

export class NewsListGroup extends GroupListBase {
  static itemTag = "news-group";
  static itemType = "news";
  static itemClass = NewsGroup;
  static defaultMin = 1;
  static defaultMax = 6;
  static defaultPrefix = "news";
  static defaultPlaceholder = "News";
  static defaultSortLabelBlock = "title";
}

NewsListGroup.define("news-list-group");
