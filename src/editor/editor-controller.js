import { applyFormatCommand } from "./editor-commands.js";
import { FORMATTABLE_MEDIA_SELECTOR, NON_TEXT_BLOCK_SELECTOR } from "./editor-selectors.js";
import { EditorHistory } from "./editor-history.js";
import { deserializeEditor, serializeEditor } from "./editor-serializer.js";
import { findSelectionTargets } from "./editor-selection.js";

const PRESERVE_SELECTION_CONTROLS = new Set([
  "format-bold",
  "format-italic",
  "format-underline",
  "format-ordered-list",
  "format-unordered-list",
  "format-align-left",
  "format-align-center",
  "format-align-right",
  "format-align-justify",
  "format-highlight",
]);

export class EditorController {
  constructor(editor) {
    this.editor = editor;
    this.activeBlock = null;
    this.activeGroup = null;
    this.activeBlockGroup = null;
    this.history = new EditorHistory({
      capture: () => serializeEditor(this.editor),
      restore: (snapshot) => this.#restoreSnapshot(snapshot),
      onChange: (state) => {
        this.editor.dispatchEvent(new CustomEvent("history-state-change", { detail: state }));
      },
    });
  }

  connect() {
    this.editor.addEventListener("selection-format-change", this.#selectionFormatChange);
    this.editor.addEventListener("format-command", this.#formatCommand);
    this.editor.addEventListener("element-type-change", this.#elementTypeChange);
    this.editor.addEventListener("group-style-change", this.#groupStyleChange);
    this.editor.addEventListener("block-group-command", this.#blockGroupCommand);
    this.editor.addEventListener("block-group-change", this.#blockGroupChange);
    this.editor.addEventListener("restore-selection", this.#restoreSelection);
    this.editor.addEventListener("editor-change", this.#editorChange);
    this.editor.addEventListener("image-change", this.#editorChange);
    this.editor.addEventListener("button-icon-change", this.#editorChange);
    this.editor.addEventListener("icon-change", this.#editorChange);
    this.editor.addEventListener("input", this.#input);
    this.editor.addEventListener("keydown", this.#keydown);
    this.editor.addEventListener("mousedown", this.#mousedown);
  }

  disconnect() {
    this.editor.removeEventListener("selection-format-change", this.#selectionFormatChange);
    this.editor.removeEventListener("format-command", this.#formatCommand);
    this.editor.removeEventListener("element-type-change", this.#elementTypeChange);
    this.editor.removeEventListener("group-style-change", this.#groupStyleChange);
    this.editor.removeEventListener("block-group-command", this.#blockGroupCommand);
    this.editor.removeEventListener("block-group-change", this.#blockGroupChange);
    this.editor.removeEventListener("restore-selection", this.#restoreSelection);
    this.editor.removeEventListener("editor-change", this.#editorChange);
    this.editor.removeEventListener("image-change", this.#editorChange);
    this.editor.removeEventListener("button-icon-change", this.#editorChange);
    this.editor.removeEventListener("icon-change", this.#editorChange);
    this.editor.removeEventListener("input", this.#input);
    this.editor.removeEventListener("keydown", this.#keydown);
    this.editor.removeEventListener("mousedown", this.#mousedown);
  }

  init(pageData = {}) {
    deserializeEditor(this.editor, pageData);
    requestAnimationFrame(() => this.history.reset());
    return this.editor;
  }

  toJSON() {
    return serializeEditor(this.editor);
  }

  undo() {
    return this.history.undo();
  }

  redo() {
    return this.history.redo();
  }

  get canUndo() {
    return this.history.canUndo;
  }

  get canRedo() {
    return this.history.canRedo;
  }

  #selectionFormatChange = (event) => {
    const { group, blockGroup, textBlock: block } = findSelectionTargets(event);
    if (!block) return;

    if (group) this.#setActiveGroup(group, blockGroup, block);
    this.#setActiveBlock(block);
    this.#notifyToolbar(event.detail);
  };

  #formatCommand = (event) => {
    applyFormatCommand(this.activeBlock, event.detail, (format) => this.#notifyToolbar(format));
    this.history.capture();
  };

  #elementTypeChange = (event) => {
    this.activeBlock?.setType?.(event.detail.type);
    this.history.capture();
  };

  #groupStyleChange = (event) => {
    if (!this.activeGroup?.setGroupStyle?.(event.detail.property, event.detail.value)) return;
    this.#notifyGroupToolbar(
      this.activeGroup.getGroupFormat(),
      this.activeBlockGroup,
      this.activeBlock,
    );
    this.history.capture();
  };

  #blockGroupCommand = (event) => {
    if (!this.activeBlockGroup) return;
    if (event.detail.action === "sort") {
      if (!this.activeBlockGroup.reorderBlocks?.(event.detail.ids, this.activeBlock)) return;
      this.#notifyGroupToolbar(
        this.activeGroup?.getGroupFormat(),
        this.activeBlockGroup,
        this.activeBlock,
      );
      this.history.capture();
      return;
    }

    const adding = event.detail.action === "add";
    const nextBlock = adding
      ? this.activeBlockGroup.addBlock(this.activeBlock)
      : this.activeBlockGroup.deleteBlock(this.activeBlock);

    if (!nextBlock && adding) return;
    this.#setActiveBlock(nextBlock);
    this.#notifyToolbar(nextBlock?.getSelectionFormat?.() ?? null);
    this.#notifyGroupToolbar(this.activeGroup?.getGroupFormat(), this.activeBlockGroup, nextBlock);
    this.history.capture();
    requestAnimationFrame(() => {
      nextBlock?.renderRoot.querySelector(".text")?.focus({ preventScroll: true });
    });
  };

  #blockGroupChange = (event) => {
    this.activeBlockGroup = event.detail.group;
    if (event.detail.activeBlock) this.#setActiveBlock(event.detail.activeBlock);
    this.#notifyGroupToolbar(
      this.activeGroup?.getGroupFormat(),
      this.activeBlockGroup,
      this.activeBlock,
    );
    this.history.capture();
  };

  #restoreSelection = () => {
    requestAnimationFrame(() => this.activeBlock?.restoreSelection?.());
  };

  #editorChange = () => {
    this.history.captureSoon();
  };

  #input = (event) => {
    const { group, blockGroup, contentBlock } = findSelectionTargets(event);
    if (!contentBlock) return;

    this.history.captureSoon(500);
    if (group && blockGroup) {
      this.#notifyGroupToolbar(group.getGroupFormat(), blockGroup, contentBlock);
    }
  };

  #keydown = (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;

    const restored = event.shiftKey ? this.redo() : this.undo();
    if (!restored) return;

    event.preventDefault();
  };

  #mousedown = (event) => {
    const { group, blockGroup, contentBlock: block } = findSelectionTargets(event);
    if (group) this.#setActiveGroup(group, blockGroup, block);
    if (block) {
      this.#setActiveBlock(block);
      if (block.matches(FORMATTABLE_MEDIA_SELECTOR)) {
        this.#notifyToolbar(block.getSelectionFormat());
      }
    }

    if (!event.composedPath().some((element) => element.localName === "format-toolbar")) return;

    this.activeBlock?.captureSelection?.({ preserve: true });
    if (
      event.composedPath().some((element) => PRESERVE_SELECTION_CONTROLS.has(element.localName))
    ) {
      event.preventDefault();
    }
  };

  #notifyToolbar(format) {
    this.editor.querySelector("format-toolbar")?.dispatchEvent(
      new CustomEvent("selection-format-change", {
        detail: format,
      }),
    );
  }

  #setActiveBlock(block) {
    if (block === this.activeBlock) return;

    this.activeBlock?.clearSelection?.();
    if (block?.matches(NON_TEXT_BLOCK_SELECTOR)) {
      document.getSelection()?.removeAllRanges();
    }
    this.activeBlock?.removeAttribute("active");
    this.activeBlock = block;
    this.activeBlock?.setAttribute("active", "");
  }

  #setActiveGroup(group, blockGroup = null, block = null) {
    if (group === this.activeGroup) {
      this.activeBlockGroup = blockGroup;
      this.#notifyGroupToolbar(group.getGroupFormat(), blockGroup, block);
      return;
    }

    this.activeGroup?.removeAttribute("active");
    this.activeGroup = group;
    this.activeBlockGroup = blockGroup;
    this.activeGroup?.setAttribute("active", "");
    this.#notifyGroupToolbar(group.getGroupFormat(), blockGroup, block);
  }

  #notifyGroupToolbar(format, blockGroup = null, block = null) {
    this.editor.querySelector("group-format-toolbar")?.dispatchEvent(
      new CustomEvent("group-format-change", {
        detail: format ? { ...format, blockGroup: blockGroup?.getFormat?.(block) ?? null } : null,
      }),
    );
  }

  #restoreSnapshot(snapshot) {
    this.activeBlock?.removeAttribute("active");
    this.activeGroup?.removeAttribute("active");
    this.activeBlock = null;
    this.activeGroup = null;
    this.activeBlockGroup = null;

    deserializeEditor(this.editor, snapshot);
    this.#notifyToolbar(null);
    this.#notifyGroupToolbar(null);
  }
}
