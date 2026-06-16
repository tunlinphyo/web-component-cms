export type CssValue = string;

export type Align = "left" | "center" | "right" | "justify" | "start" | "end";
export type RichTextType = "p" | "h1" | "h2" | "h3";
export type ButtonTag = "button" | "a";
export type LinkTarget = "_self" | "_blank";

export type PageGroupType =
  | "header"
  | "coming-soon"
  | "about-hokupay"
  | "footer"
  | string;

export type PageGroup = {
  id: string;
  type: PageGroupType;
  order: number;
  backgroundColor: CssValue;
  borderWidth: CssValue;
  borderColor: CssValue;
  borderStyle: string;
  borderRadius: CssValue;
  blocks: PageBlock[];
};

export type PageBlock =
  | RichTextBlock
  | ImageBlock
  | ButtonBlock
  | IconBlock;

export type RichTextBlock = {
  id: string;
  type: RichTextType;
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
  text: string;
  design: "primary" | "dark" | "outline" | "soft" | "nav";
  icon: string;
  iconPosition: "start" | "end" | "none";
  link: string;
  target: LinkTarget;
  tag: ButtonTag;
  align: Align;
};

export type IconBlock = {
  id: string;
  type: "icon";
  icon: string;
  fontSize: CssValue;
  color: CssValue;
  backgroundColor: CssValue;
  link: string;
  align: Align;
};

export type PageData = PageGroup[];
