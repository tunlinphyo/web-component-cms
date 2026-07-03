import {
  BLOCK_GROUP_SELECTOR,
  CONTENT_BLOCK_SELECTOR,
  GROUP_SELECTOR,
  TEXT_BLOCK_SELECTOR,
} from "./editor-selectors.js";

export function findSelectionTargets(event) {
  const path = event.composedPath();

  return {
    group: findInPath(path, GROUP_SELECTOR),
    blockGroup: findInPath(path, BLOCK_GROUP_SELECTOR),
    textBlock: findInPath(path, TEXT_BLOCK_SELECTOR),
    contentBlock: findInPath(path, CONTENT_BLOCK_SELECTOR),
  };
}

export function findInPath(path, selector) {
  return path.find((element) => element.matches?.(selector)) ?? null;
}

export function isComposedDescendant(ancestor, node) {
  let current = node;

  while (current) {
    if (current === ancestor) return true;

    const parent = current.parentNode;
    if (parent) {
      current = parent;
      continue;
    }

    const root = current.getRootNode?.();
    current = root?.host ?? null;
  }

  return false;
}
