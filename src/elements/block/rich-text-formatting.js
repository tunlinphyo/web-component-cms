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
  onFontSizeChange,
}) {
  selectRange(selection, range);

  if (command === "bold" && type !== "p") {
    toggleBlockBold(editor, onFontWeightChange);
  } else if (INLINE_COMMAND_SELECTORS.has(command)) {
    toggleInlineCommand(command, value, editor, range, selection);
  } else if (command === "linkEdit") {
    if (!prepareLinkSelection(editor, range, selection)) return { range, shouldNotify: false };
  } else if (command === "fontSize") {
    if (type === "p") {
      applyFontSize(value, editor, range, selection);
    } else {
      applyBlockFontSize(value, editor, onFontSizeChange);
    }
  } else if (command === "backgroundColor") {
    applyHighlightBackgroundColor(value, editor, range, selection);
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
  const fontSizeElement = type === "p" ? findSelectedAncestor("[style*='font-size']") : editor;
  const highlightElement = findSelectedAncestor("mark");
  const highlightStyles = highlightElement ? getComputedStyle(highlightElement) : null;

  return {
    bold: editor?.style.fontWeight !== "normal" && document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    orderedList: document.queryCommandState("insertOrderedList"),
    unorderedList: document.queryCommandState("insertUnorderedList"),
    align,
    fontSize: fontSizeElement?.style.fontSize ?? "",
    fontSizeApplied: Boolean(fontSizeElement),
    fontFamily: editor?.style.fontFamily ?? "",
    type,
    collapsed: range.collapsed,
    highlight: Boolean(highlightElement),
    backgroundColor:
      highlightStyles?.getPropertyValue("--mark-highlight-color").trim() ||
      highlightStyles?.getPropertyValue("--yellow-200").trim() ||
      "",
    link: findSelectedAncestor("a")?.getAttribute("href") ?? "",
    color: document.queryCommandValue("foreColor"),
    colorApplied: Boolean(findSelectedAncestor("font[color], [style*='color']")),
  };
}

function applyHighlightBackgroundColor(value, editor, range, selection) {
  const highlightElement = getSelectedAncestor(editor, range, "mark");
  if (!highlightElement) return;

  highlightElement.style.setProperty("--mark-highlight-color", value);
  range.selectNodeContents(highlightElement);
  selectRange(selection, range);
}

function applyBlockFontSize(value, editor, onFontSizeChange) {
  editor.style.fontSize = value;
  onFontSizeChange(value);
}

function applyFontSize(value, editor, range, selection) {
  if (range.collapsed) return;

  const fontSizeElement = getSelectedAncestor(editor, range, "[style*='font-size']");
  const selectionWithinFontSize = fontSizeElement?.contains(range.endContainer);
  const fragment = range.extractContents();
  removeFontSize(fragment);

  if (value) {
    const element = document.createElement("span");
    element.style.fontSize = value;
    element.append(fragment);
    range.insertNode(element);
    range.selectNodeContents(element);
  } else if (selectionWithinFontSize) {
    insertWithoutAncestorFontSize(fontSizeElement, fragment, range);
  } else {
    insertAndSelectFragment(fragment, range);
  }

  selectRange(selection, range);
}

function removeFontSize(fragment) {
  for (const element of fragment.querySelectorAll("[style*='font-size']")) {
    element.style.removeProperty("font-size");
    if (!element.getAttribute("style")) element.removeAttribute("style");
  }
}

function insertWithoutAncestorFontSize(fontSizeElement, fragment, range) {
  const afterRange = document.createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEnd(fontSizeElement, fontSizeElement.childNodes.length);

  const afterElement = fontSizeElement.cloneNode(false);
  afterElement.append(afterRange.extractContents());

  const selectedElement = fontSizeElement.cloneNode(false);
  selectedElement.style.removeProperty("font-size");
  if (!selectedElement.getAttribute("style")) selectedElement.removeAttribute("style");
  selectedElement.append(fragment);

  const selectedFragment = document.createDocumentFragment();
  if (selectedElement.attributes.length || selectedElement.tagName !== "SPAN") {
    selectedFragment.append(selectedElement);
  } else {
    selectedFragment.append(...selectedElement.childNodes);
  }

  addSelectionMarkers(selectedFragment);
  fontSizeElement.after(selectedFragment, afterElement);
  selectBetweenMarkers(range);

  if (!fontSizeElement.hasChildNodes()) fontSizeElement.remove();
  if (!afterElement.hasChildNodes()) afterElement.remove();
}

function insertAndSelectFragment(fragment, range) {
  addSelectionMarkers(fragment);
  range.insertNode(fragment);
  selectBetweenMarkers(range);
}

function addSelectionMarkers(fragment) {
  fragment.prepend(document.createComment("selection-start"));
  fragment.append(document.createComment("selection-end"));
}

function selectBetweenMarkers(range) {
  const root = range.commonAncestorContainer.getRootNode();
  const iterator = document.createNodeIterator(root, NodeFilter.SHOW_COMMENT);
  let startMarker = null;
  let endMarker = null;
  let node;

  while ((node = iterator.nextNode())) {
    if (node.data === "selection-start") startMarker = node;
    if (node.data === "selection-end") endMarker = node;
    if (startMarker && endMarker) break;
  }

  if (!startMarker || !endMarker) return;

  range.setStartAfter(startMarker);
  range.setEndBefore(endMarker);
  startMarker.remove();
  endMarker.remove();
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
