import { CONTENT_BLOCK_SELECTOR, GROUP_SELECTOR } from "./editor-selectors.js";
import { CURRENT_PAGE_VERSION, normalizePageGroups } from "../schema/page-normalize.js";

export function deserializeEditor(editor, pageData = {}) {
  const groupsData = normalizePageGroups(pageData);
  const groupOrder = editor.querySelector("group-order");

  groupOrder?.init(groupsData);
  removeGroupsOutsideSnapshot(groupOrder, groupsData);

  const groupsById = new Map(
    [...editor.querySelectorAll(GROUP_SELECTOR)].map((group) => [
      group.getAttribute("group-id"),
      group,
    ]),
  );
  const blocksById = new Map(getContentBlocks(editor).map((block) => [block.blockId, block]));

  for (const data of groupsData) {
    if (Array.isArray(data.blocks)) {
      groupsById.get(data.id)?.init(data);
    } else {
      blocksById.get(data.id)?.init(data);
    }
  }

  return editor;
}

export function serializeEditor(editor) {
  return {
    version: CURRENT_PAGE_VERSION,
    groups: [...editor.querySelectorAll(GROUP_SELECTOR)].map((group) => group.toJSON()),
  };
}

function getContentBlocks(editor) {
  const ungroupedBlocks = [...editor.querySelectorAll(CONTENT_BLOCK_SELECTOR)];
  const groupedBlocks = [...editor.querySelectorAll(GROUP_SELECTOR)].flatMap(
    (group) => group.blocks,
  );

  return [...ungroupedBlocks, ...groupedBlocks];
}

function removeGroupsOutsideSnapshot(groupOrder, groupsData) {
  if (!groupOrder) return;

  const snapshotIds = new Set(groupsData.map((group) => group.id));
  for (const group of groupOrder.querySelectorAll(":scope > [group-id]")) {
    if (!snapshotIds.has(group.getAttribute("group-id"))) group.remove();
  }
}
