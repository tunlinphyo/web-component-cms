import { expect, test } from "vite-plus/test";
import { normalizeMarkClass, removeEmptyInlineElement } from "./rich-text-formatting.js";
import { needsParagraphWrapping } from "./utils.js";

function createElement({ text = "", renderedElement = null } = {}) {
  let removed = false;

  return {
    element: {
      textContent: text,
      querySelector: () => renderedElement,
      remove: () => {
        removed = true;
      },
    },
    wasRemoved: () => removed,
  };
}

test("removes a formatting wrapper that contains only empty text nodes", () => {
  const wrapper = createElement();

  removeEmptyInlineElement(wrapper.element);

  expect(wrapper.wasRemoved()).toBe(true);
});

test("preserves formatting wrappers containing whitespace or rendered elements", () => {
  const whitespaceWrapper = createElement({ text: " " });
  const lineBreakWrapper = createElement({ renderedElement: {} });

  removeEmptyInlineElement(whitespaceWrapper.element);
  removeEmptyInlineElement(lineBreakWrapper.element);

  expect(whitespaceWrapper.wasRemoved()).toBe(false);
  expect(lineBreakWrapper.wasRemoved()).toBe(false);
});

test("does not rebuild valid paragraph and list children after a list command", () => {
  const editor = {
    childNodes: [
      { nodeType: 1, tagName: "P" },
      { nodeType: 1, tagName: "UL" },
      { nodeType: 1, tagName: "OL" },
    ],
  };

  expect(needsParagraphWrapping(editor)).toBe(false);
});

test("repairs direct text or inline children after a list command", () => {
  const directTextEditor = {
    childNodes: [{ nodeType: 3, textContent: "List item" }],
  };
  const inlineElementEditor = {
    childNodes: [{ nodeType: 1, tagName: "SPAN" }],
  };

  expect(needsParagraphWrapping(directTextEditor)).toBe(true);
  expect(needsParagraphWrapping(inlineElementEditor)).toBe(true);
});

test("accepts one safe configured mark class", () => {
  expect(normalizeMarkClass("mark-primary")).toBe("mark-primary");
  expect(normalizeMarkClass("mark-primary unsafe")).toBe("");
});
