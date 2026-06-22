export type CssValue = string;

export type Align = "left" | "center" | "right" | "justify" | "start" | "end";
export type RichTextType = "p" | "h1" | "h2" | "h3";
export type ButtonTag = "button" | "a";
export type LinkTarget = "_self" | "_blank";

export type PageGroupType = string;

export type PageDocument = {
  version: 1;
  groups: PageGroup[];
};

export type PageGroupStyle = {
  backgroundColor: CssValue;
  borderWidth: CssValue;
  borderColor: CssValue;
  borderStyle: string;
  borderRadius: CssValue;
  disabled?: boolean;
};

export type PageGroup = {
  id: string;
  type: PageGroupType;
  sort: number;
  style: PageGroupStyle;
  blocks: PageBlock[];
};

export type PageBlock = RichTextBlock | ImageBlock | ButtonBlock | NavsBlock | IconBlock;

export type RichTextBlock = {
  id: string;
  type: RichTextType;
  features?: string;
  value: string;
  textAlign: Align;
  fontWeight: CssValue;
  fontSize: CssValue;
  fontFamily: CssValue;
  predefinedMargin: CssValue;
};

export type ImageBlock = {
  id: string;
  type: "image";
  features?: string;
  src: string;
  alt: string;
  maxWidth: CssValue;
  align: Align;
  link: string;
  target: LinkTarget;
  backgroundColor: CssValue;
  borderWidth: CssValue;
  borderColor: CssValue;
  borderStyle: string;
  borderRadius: CssValue;
};

export type ButtonBlock = {
  id: string;
  type: "button";
  features?: string;
  text: string;
  design: "primary" | "dark" | "outline" | "soft" | "nav";
  icon: string;
  iconPosition: "start" | "end" | "none";
  link: string;
  target: LinkTarget;
  tag: ButtonTag;
  align: Align;
  sort?: number;
};

export type NavsBlock = {
  id: string;
  type: "navs";
  sort?: number;
  children: ButtonBlock[];
};

export type IconBlock = {
  id: string;
  type: "icon";
  features?: string;
  icon: string;
  fontSize: CssValue;
  color: CssValue;
  backgroundColor: CssValue;
  link: string;
  align: Align;
};

export type PageData = PageDocument;
