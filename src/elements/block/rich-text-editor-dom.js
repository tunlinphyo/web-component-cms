import { isEmptyHtml, normalizeParagraphs, selectRange } from "./utils.js";

export function getEditorElement(renderRoot) {
  return renderRoot.querySelector(".editor");
}

export function getEditorSelection(renderRoot) {
  return renderRoot.getSelection?.() ?? document.getSelection();
}

export function setDefaultParagraphSeparator() {
  document.execCommand("defaultParagraphSeparator", false, "p");
}

export function initializeEditor(editor, { value, type, placeholder, textAlign, fontWeight }) {
  if (type === "p") {
    editor.innerHTML = value || "<p></p>";
    updateEditorPlaceholder(editor, placeholder);
  } else {
    editor.innerHTML = value || "";
    editor.style.removeProperty("--placeholder");
  }

  applyEditorPresentation(editor, { textAlign, fontWeight });
  setDefaultParagraphSeparator();
}

export function captureEditorState(editor) {
  return {
    value: editor.innerHTML,
    textAlign: editor.style.textAlign,
    fontWeight: editor.style.fontWeight,
  };
}

export function restoreEditorState(editor, { value, type, textAlign, fontWeight }) {
  editor.innerHTML = normalizeParagraphs(value, type);
  applyEditorPresentation(editor, { textAlign, fontWeight });
}

export function syncEditorFromProperties(editor, { value, type, textAlign, fontWeight }) {
  let normalizedValue = normalizeParagraphs(value, type);
  if (isEmptyHtml(normalizedValue)) normalizedValue = "";

  if (editor.innerHTML !== normalizedValue) editor.innerHTML = normalizedValue;
  applyEditorPresentation(editor, { textAlign, fontWeight });
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
    editor.innerHTML = "";
    return;
  }

  const normalizedValue = normalizeParagraphs(html, type);
  if (normalizedValue === html) return;

  const selection = document.getSelection();
  editor.innerHTML = normalizedValue;
  if (selection?.rangeCount) selectRange(selection, selection.getRangeAt(0).cloneRange());
}

export function placeCaretInEmptyEditor(editor, selection) {
  if (!editor || editor.textContent.trim() !== "") return false;

  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  selectRange(selection, range);
  return true;
}

function applyEditorPresentation(editor, { textAlign, fontWeight }) {
  editor.style.textAlign = textAlign;
  editor.style.fontWeight = fontWeight;
}
