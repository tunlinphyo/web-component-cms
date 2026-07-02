import { isEmptyHtml, normalizeBlockContent, normalizeParagraphs, selectRange } from "./utils.js";

export function getEditorElement(renderRoot) {
  return renderRoot.querySelector(".editor");
}

export function getEditorSelection(renderRoot) {
  return renderRoot.getSelection?.() ?? document.getSelection();
}

export function setDefaultParagraphSeparator() {
  document.execCommand("defaultParagraphSeparator", false, "p");
}

export function initializeEditor(
  editor,
  { value, type, placeholder, textAlign, fontWeight, fontSize, fontFamily },
) {
  if (type === "p") {
    editor.innerHTML = isEmptyHtml(value) ? "<p></p>" : value;
    updateEditorPlaceholder(editor, placeholder);
  } else {
    editor.innerHTML = isEmptyHtml(value) ? "" : value;
    editor.style.removeProperty("--placeholder");
  }

  applyEditorPresentation(editor, { type, textAlign, fontWeight, fontSize, fontFamily });
  setDefaultParagraphSeparator();
}

export function captureEditorState(editor) {
  return {
    value: editor.innerHTML,
    textAlign: editor.style.textAlign,
    fontWeight: editor.style.fontWeight,
    fontSize: editor.style.fontSize,
    fontFamily: editor.style.fontFamily,
  };
}

export function restoreEditorState(
  editor,
  { value, type, textAlign, fontWeight, fontSize, fontFamily },
) {
  editor.innerHTML = normalizeBlockContent(value, type);
  applyEditorPresentation(editor, { type, textAlign, fontWeight, fontSize, fontFamily });
}

export function syncEditorFromProperties(
  editor,
  { value, type, textAlign, fontWeight, fontSize, fontFamily },
) {
  let normalizedValue = normalizeBlockContent(value, type);
  if (isEmptyHtml(normalizedValue)) normalizedValue = "";

  if (editor.innerHTML !== normalizedValue) editor.innerHTML = normalizedValue;
  applyEditorPresentation(editor, { type, textAlign, fontWeight, fontSize, fontFamily });
}

export function updateEditorPlaceholder(editor, placeholder) {
  const escapedPlaceholder = (placeholder || "").replace(/"/g, '\\"');
  editor.style.setProperty("--placeholder", `"${escapedPlaceholder}"`);
}

export function normalizeEditorParagraphs(editor, type) {
  const normalizedValue = normalizeParagraphs(editor.innerHTML, type);
  if (normalizedValue === editor.innerHTML) return false;

  editor.innerHTML = normalizedValue;
  return true;
}

export function normalizeEditorInput(editor, type) {
  const html = editor.innerHTML;
  if (isEmptyHtml(html)) {
    if (type !== "p") return false;

    const existingParagraph =
      editor.childElementCount === 1 && editor.firstElementChild?.tagName === "P"
        ? editor.firstElementChild
        : null;
    const paragraph = existingParagraph ?? document.createElement("p");
    paragraph.replaceChildren();
    if (!existingParagraph) editor.replaceChildren(paragraph);

    const selection = editor.getRootNode().getSelection?.() ?? document.getSelection();
    if (selection) {
      const range = document.createRange();
      range.setStart(paragraph, 0);
      range.collapse(true);
      selectRange(selection, range);
    }
    return true;
  }

  const normalizedValue = normalizeParagraphs(html, type);
  if (normalizedValue === html) return false;

  const selection = editor.getRootNode().getSelection?.() ?? document.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  if (!range || !editor.contains(range.commonAncestorContainer)) {
    editor.innerHTML = normalizedValue;
    return true;
  }

  const marker = document.createElement("span");
  marker.setAttribute("data-editor-caret", "");

  const caretRange = range.cloneRange();
  caretRange.collapse(false);
  caretRange.insertNode(marker);

  editor.innerHTML = normalizeParagraphs(editor.innerHTML, type);

  const restoredMarker = editor.querySelector("[data-editor-caret]");
  if (!restoredMarker || !selection) return true;

  const restoredRange = document.createRange();
  restoredRange.setStartBefore(restoredMarker);
  restoredRange.collapse(true);
  restoredMarker.remove();
  selectRange(selection, restoredRange);
  return true;
}

export function placeCaretInEmptyEditor(editor, selection) {
  if (!editor || !selection || editor.textContent.trim() !== "") return false;

  const range = document.createRange();
  const paragraph =
    editor.childElementCount === 1 && editor.firstElementChild?.tagName === "P"
      ? editor.firstElementChild
      : null;

  if (paragraph) range.setStart(paragraph, 0);
  else {
    range.selectNodeContents(editor);
    range.collapse(false);
  }

  range.collapse(true);
  selectRange(selection, range);
  return true;
}

function applyEditorPresentation(editor, { type, textAlign, fontWeight, fontSize, fontFamily }) {
  editor.style.textAlign = textAlign;
  editor.style.fontWeight = fontWeight;
  editor.style.fontSize = type === "p" ? "" : fontSize;
  editor.style.fontFamily =
    fontFamily || (type === "p" ? "var(--font-body)" : "var(--font-heading)");
}
