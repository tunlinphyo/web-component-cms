const BLOCK_TYPES = ["h1", "h2", "h3", "p"];
const PARAGRAPH_CONTENT_TAGS = ["P", "UL", "OL"];

export function normalizeBlockType(type) {
  return BLOCK_TYPES.includes(type) ? type : "p";
}

export function convertBlockTypeContent(value, previousType, nextType) {
  if (previousType === "p" && nextType !== "p") {
    return normalizeHeadingLines(paragraphsToBreaks(value));
  }
  if (previousType !== "p" && nextType === "p") {
    return breaksToParagraphs(value?.replace(/\r\n?|\n/g, "<br>"));
  }

  return normalizeBlockContent(value, nextType);
}

export function normalizeBlockContent(value, type) {
  return type === "p" ? normalizeParagraphs(value, type) : normalizeHeadingLines(value);
}

export function normalizeParagraphs(value, type) {
  if (type !== "p" || !value) return value;

  const template = document.createElement("template");
  const output = document.createElement("div");
  let paragraph = null;
  template.innerHTML = value;

  for (const node of Array.from(template.content.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE && PARAGRAPH_CONTENT_TAGS.includes(node.tagName)) {
      paragraph = null;
      output.append(node);
    } else if (node.nodeName === "BR") {
      paragraph = null;
    } else {
      paragraph ??= output.appendChild(document.createElement("p"));
      paragraph.append(node);
    }
  }

  return output.innerHTML;
}

function normalizeHeadingLines(value) {
  if (!value) return value;

  const template = document.createElement("template");
  template.innerHTML = value.replace(/\r\n?|\n/g, "\n");

  for (const lineBreak of template.content.querySelectorAll("br")) {
    lineBreak.replaceWith(document.createTextNode("\n"));
  }

  return template.innerHTML;
}

function paragraphsToBreaks(value) {
  if (!value) return value;

  const template = document.createElement("template");
  const output = document.createElement("div");
  let trailingParagraphBreak = null;
  template.innerHTML = value;

  for (const node of Array.from(template.content.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "P") {
      if (node.lastChild?.nodeName === "BR") node.lastChild.remove();
      output.append(...node.childNodes);
      trailingParagraphBreak = output.appendChild(document.createElement("br"));
    } else {
      trailingParagraphBreak = null;
      output.append(node);
    }
  }

  trailingParagraphBreak?.remove();
  return output.innerHTML;
}

function breaksToParagraphs(value) {
  if (!value) return value;

  const template = document.createElement("template");
  const output = document.createElement("div");
  let paragraph = null;
  let endedWithBreak = false;
  template.innerHTML = value;

  for (const node of Array.from(template.content.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE && PARAGRAPH_CONTENT_TAGS.includes(node.tagName)) {
      paragraph = null;
      endedWithBreak = false;
      output.append(node);
    } else if (node.nodeName === "BR") {
      paragraph ??= output.appendChild(document.createElement("p"));
      paragraph = null;
      endedWithBreak = true;
    } else {
      paragraph ??= output.appendChild(document.createElement("p"));
      paragraph.append(node);
      endedWithBreak = false;
    }
  }

  if (endedWithBreak) output.appendChild(document.createElement("p"));
  return output.innerHTML;
}

export function isEmptyHtml(html) {
  return html === "" || /^\s*(?:<br\s*\/?>)+\s*$/i.test(html);
}

export function serializeHtml(html, trimTrailingBreaks = true) {
  const serialized = html.replace(/\r\n?|\n/g, "<br>");
  return trimTrailingBreaks ? serialized.replace(/(?:<br>)+$/, "") : serialized;
}

export function isSelectionInside(editor, selection) {
  return Boolean(
    selection?.rangeCount &&
    editor?.contains(selection.anchorNode) &&
    editor.contains(selection.focusNode),
  );
}

export function selectRange(selection, range) {
  selection.removeAllRanges();
  selection.addRange(range);
}

export function rangesMatch(firstRange, secondRange) {
  return Boolean(
    firstRange &&
    secondRange &&
    firstRange.startContainer === secondRange.startContainer &&
    firstRange.startOffset === secondRange.startOffset &&
    firstRange.endContainer === secondRange.endContainer &&
    firstRange.endOffset === secondRange.endOffset,
  );
}

export function getSelectedAncestor(editor, range, selector) {
  if (!editor || !range) return null;

  let element = range.startContainer;
  if (element.nodeType !== Node.ELEMENT_NODE) element = element.parentElement;

  while (element && element !== editor) {
    if (element.matches(selector)) return element;
    element = element.parentElement;
  }

  return null;
}

export function unwrapListsFromParagraphs(editor) {
  for (const list of editor.querySelectorAll("p > ul, p > ol")) {
    const paragraph = list.parentElement;
    const before = document.createElement("p");
    const after = document.createElement("p");

    while (paragraph.firstChild !== list) before.append(paragraph.firstChild);
    while (list.nextSibling) after.append(list.nextSibling);

    paragraph.replaceWith(
      ...(before.hasChildNodes() ? [before] : []),
      list,
      ...(after.hasChildNodes() ? [after] : []),
    );
  }
}

export function wrapParagraphContent(editor) {
  const fragment = document.createDocumentFragment();
  let paragraph = null;

  for (const node of Array.from(editor.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE && PARAGRAPH_CONTENT_TAGS.includes(node.tagName)) {
      paragraph = null;
      fragment.append(node);
    } else if (node.nodeName === "BR") {
      paragraph = null;
      node.remove();
    } else {
      paragraph ??= fragment.appendChild(document.createElement("p"));
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV") {
        paragraph.append(...node.childNodes);
        node.remove();
      } else {
        paragraph.append(node);
      }
    }
  }

  editor.append(fragment);
}

export function removeLinkSelectionPreview(editor, range) {
  const preview =
    getSelectedAncestor(editor, range, "[data-link-selection]") ||
    editor?.querySelector("[data-link-selection]");
  if (!preview) return;

  preview.removeAttribute("data-link-selection");
  if (preview.localName === "a") return;

  const firstChild = preview.firstChild;
  const lastChild = preview.lastChild;
  preview.replaceWith(...preview.childNodes);
  if (range) {
    range.setStartBefore(firstChild);
    range.setEndAfter(lastChild);
  }
}

export function insertPlainText(selection, text) {
  if (!selection?.rangeCount) return false;

  const range = selection.getRangeAt(0);
  const node = document.createTextNode(text);
  range.deleteContents();
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selectRange(selection, range);
  return true;
}
