import {
  getSelectedAncestor,
  rangesMatch,
  selectRange,
  unwrapListsFromParagraphs,
  wrapParagraphContent,
} from "./utils.js";

const INLINE_COMMAND_SELECTORS = new Map([
  ["bold", "strong, b"],
  ["italic", "em, i"],
  ["underline", "u"],
]);
const LIST_COMMANDS = new Set(["insertOrderedList", "insertUnorderedList"]);

export function applySelectionCommand({
  command,
  value,
  editor,
  type,
  range,
  selection,
  onFontWeightChange,
}) {
  selectRange(selection, range);

  if (command === "bold" && type !== "p") {
    toggleBlockBold(editor, onFontWeightChange);
  } else if (INLINE_COMMAND_SELECTORS.has(command)) {
    toggleInlineCommand(command, value, editor, range, selection);
  } else if (command === "linkEdit") {
    if (!prepareLinkSelection(editor, range, selection)) return { range, shouldNotify: false };
  } else if (command === "highlight" || command === "link") {
    applyWrappedSelection(command, value, editor, range, selection);
  } else {
    executeDocumentCommand(command, value, editor, type);
  }

  return {
    range: selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null,
    shouldNotify: true,
  };
}

export function describeSelectionFormat({ editor, type, textAlign, range, selection }) {
  const align = editor?.style.textAlign || textAlign || "left";
  if (!range || !selection) return { align, type };

  const currentRange = selection.rangeCount ? selection.getRangeAt(0) : null;
  if (!rangesMatch(currentRange, range)) selectRange(selection, range);

  const findSelectedAncestor = (selector) => getSelectedAncestor(editor, range, selector);

  return {
    bold: editor?.style.fontWeight !== "normal" && document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    orderedList: document.queryCommandState("insertOrderedList"),
    unorderedList: document.queryCommandState("insertUnorderedList"),
    align,
    type,
    collapsed: range.collapsed,
    highlight: Boolean(findSelectedAncestor("mark")),
    link: findSelectedAncestor("a")?.getAttribute("href") ?? "",
    color: document.queryCommandValue("foreColor"),
    colorApplied: Boolean(findSelectedAncestor("font[color], [style*='color']")),
  };
}

function toggleBlockBold(editor, onFontWeightChange) {
  const fontWeight = editor.style.fontWeight === "normal" ? "" : "normal";
  editor.style.fontWeight = fontWeight;
  onFontWeightChange(fontWeight);
}

function toggleInlineCommand(command, value, editor, range, selection) {
  const formatElement =
    range.collapsed && getSelectedAncestor(editor, range, INLINE_COMMAND_SELECTORS.get(command));

  if (!formatElement) {
    document.execCommand(command, false, value);
    return;
  }

  const marker = document.createComment("caret");
  range.insertNode(marker);
  formatElement.replaceWith(...formatElement.childNodes);
  range.setStartBefore(marker);
  range.collapse(true);
  marker.remove();
  selectRange(selection, range);
}

function prepareLinkSelection(editor, range, selection) {
  const link = getSelectedAncestor(editor, range, "a");

  if (link) {
    link.toggleAttribute("data-link-selection", true);
    range.selectNodeContents(link);
  } else if (range.collapsed) {
    return false;
  } else if (!getSelectedAncestor(editor, range, "[data-link-selection]")) {
    const preview = document.createElement("span");
    preview.toggleAttribute("data-link-selection", true);
    preview.append(range.extractContents());
    range.insertNode(preview);
    range.selectNodeContents(preview);
  }

  selectRange(selection, range);
  return true;
}

function applyWrappedSelection(command, value, editor, range, selection) {
  const selector = command === "highlight" ? "mark" : "a";
  const formatElement = getSelectedAncestor(editor, range, selector);
  const preview =
    command === "link" ? getSelectedAncestor(editor, range, "[data-link-selection]") : null;

  if (command === "link" && value && formatElement) {
    updateLink(formatElement, value, range);
  } else if (command === "link" && value && preview) {
    replaceLinkPreview(preview, value, range);
  } else if (formatElement) {
    unwrapFormatElement(formatElement, range);
  } else if (command === "highlight" || value) {
    wrapSelection(command, value, range);
  }

  selectRange(selection, range);
}

function updateLink(link, value, range) {
  link.setAttribute("href", value);
  link.removeAttribute("data-link-selection");
  range.selectNodeContents(link);
}

function replaceLinkPreview(preview, value, range) {
  const link = document.createElement("a");
  link.setAttribute("href", value);
  link.append(...preview.childNodes);
  preview.replaceWith(link);
  range.selectNodeContents(link);
}

function unwrapFormatElement(formatElement, range) {
  const firstChild = formatElement.firstChild;
  const lastChild = formatElement.lastChild;
  formatElement.replaceWith(...formatElement.childNodes);
  range.setStartBefore(firstChild);
  range.setEndAfter(lastChild);
}

function wrapSelection(command, value, range) {
  const element = document.createElement(command === "highlight" ? "mark" : "a");
  if (command === "link") element.setAttribute("href", value);
  element.append(range.extractContents());
  range.insertNode(element);
  range.selectNodeContents(element);
}

function executeDocumentCommand(command, value, editor, type) {
  document.execCommand(command, false, value);
  if (!LIST_COMMANDS.has(command)) return;

  unwrapListsFromParagraphs(editor);
  if (type === "p") wrapParagraphContent(editor);
}
