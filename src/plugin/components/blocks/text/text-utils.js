const TEXT_ELEMENT_TYPES = ["h1", "h2", "h3", "p"];
const PARAGRAPH_CONTENT_TAGS = ["P", "UL", "OL"];
const ELEMENT_NODE = 1;

export function normalizeBlockType(type) {
  return TEXT_ELEMENT_TYPES.includes(type) ? type : "p";
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
  if (!html) return true;

  const template = document.createElement("template");
  template.innerHTML = html;

  const text = template.content.textContent.replace(/[\u00a0\u200b-\u200d\ufeff]/g, "").trim();
  const hasEmbeddedContent = template.content.querySelector(
    "audio, canvas, embed, hr, iframe, img, input, object, select, svg, textarea, video",
  );

  return text === "" && !hasEmbeddedContent;
}

export function serializeHtml(html, trimTrailingBreaks = true) {
  let serialized = html.replace(/\r\n?|\n/g, "<br>");
  serialized = removeEmptyParagraphsAdjacentToLists(serialized);
  if (!trimTrailingBreaks) return serialized;

  serialized = serialized.replace(/(?:<br>)+$/, "");
  serialized = serialized.replace(/(?:<br>)+(?=<\/p>\s*$)/i, "");
  return removeTrailingEmptyParagraphs(serialized);
}

const EMPTY_PARAGRAPH_PATTERN = String.raw`<p(?:\s[^>]*)?>\s*</p>`;

function removeEmptyParagraphsAdjacentToLists(html) {
  const beforeList = new RegExp(`${EMPTY_PARAGRAPH_PATTERN}(?=\\s*<(?:ol|ul)\\b)`, "gi");
  const afterList = new RegExp(`(</(?:ol|ul)>)\\s*${EMPTY_PARAGRAPH_PATTERN}`, "gi");

  return html.replace(beforeList, "").replace(afterList, "$1");
}

function removeTrailingEmptyParagraphs(html) {
  const trailingParagraphs = new RegExp(`(?:${EMPTY_PARAGRAPH_PATTERN}\\s*)+$`, "gi");
  return html.replace(trailingParagraphs, "");
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
  if (!needsParagraphWrapping(editor)) return false;

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
  return true;
}

export function needsParagraphWrapping(editor) {
  return Array.from(editor.childNodes).some(
    (node) => node.nodeType !== ELEMENT_NODE || !PARAGRAPH_CONTENT_TAGS.includes(node.tagName),
  );
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

export function insertPlainTextAsParagraphs(editor, selection, text) {
  const normalizedText = text.replace(/<br\s*\/?>/gi, "\n").replace(/\r\n?|\n/g, "\n");
  if (!selection?.rangeCount) return false;

  const range = selection.getRangeAt(0);
  const startElement =
    range.startContainer.nodeType === ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement;
  const paragraph = startElement?.closest("p");

  if (!paragraph || !editor.contains(paragraph)) {
    if (editor.textContent.trim()) return insertPlainText(selection, normalizedText);

    editor.replaceChildren();
    const lines = normalizedText.split("\n");
    let caretContainer;

    for (const line of lines) {
      const nextParagraph = document.createElement("p");
      if (line) {
        caretContainer = document.createTextNode(line);
        nextParagraph.append(caretContainer);
      } else {
        caretContainer = nextParagraph;
      }
      editor.append(nextParagraph);
    }

    const caretRange = document.createRange();
    if (caretContainer.nodeType === ELEMENT_NODE) {
      caretRange.setStart(caretContainer, 0);
    } else {
      caretRange.setStartAfter(caretContainer);
    }
    caretRange.collapse(true);
    selectRange(selection, caretRange);
    return true;
  }

  if (!normalizedText.includes("\n")) return insertPlainText(selection, normalizedText);

  range.deleteContents();
  const trailingRange = document.createRange();
  trailingRange.setStart(range.startContainer, range.startOffset);
  trailingRange.setEnd(paragraph, paragraph.childNodes.length);
  const trailingContent = trailingRange.extractContents();

  const lines = normalizedText.split("\n");
  const firstLine = document.createTextNode(lines.shift());
  range.insertNode(firstLine);

  let currentParagraph = paragraph;
  let caretContainer = firstLine;
  for (const line of lines) {
    const nextParagraph = document.createElement("p");
    currentParagraph.after(nextParagraph);
    currentParagraph = nextParagraph;

    if (line) {
      caretContainer = document.createTextNode(line);
      currentParagraph.append(caretContainer);
    } else {
      caretContainer = currentParagraph;
    }
  }

  const caretRange = document.createRange();
  if (caretContainer.nodeType === ELEMENT_NODE) {
    caretRange.setStart(caretContainer, 0);
  } else {
    caretRange.setStartAfter(caretContainer);
  }
  caretRange.collapse(true);
  currentParagraph.append(trailingContent);
  selectRange(selection, caretRange);
  return true;
}
