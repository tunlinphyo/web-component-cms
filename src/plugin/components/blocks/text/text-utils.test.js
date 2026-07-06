import { expect, test } from "vite-plus/test";
import { serializeHtml, serializeTextChildren } from "./text-utils.js";

test("removes empty list-adjacent and trailing editor paragraphs", () => {
  const value = "<p>First</p><p></p><ol><li>One</li><li>Two</li></ol><p>Last</p><p></p>";

  expect(serializeHtml(value)).toBe("<p>First</p><ol><li>One</li><li>Two</li></ol><p>Last</p>");
});

test("removes empty paragraphs immediately after lists", () => {
  const value = "<ul><li>One</li></ul><p></p><p>Next</p>";

  expect(serializeHtml(value)).toBe("<ul><li>One</li></ul><p>Next</p>");
});

test("preserves intentional blank lines", () => {
  const value = "<p>First</p><p><br></p><p>Second</p><p></p><p>Third</p>";

  expect(serializeHtml(value)).toBe(value);
});

test("removes trailing breaks from the final paragraph", () => {
  const value = "<p>First</p><p>Second<br></p>";

  expect(serializeHtml(value)).toBe("<p>First</p><p>Second</p>");
});

test("serializes inline text marks after a line break as separate children", () => {
  globalThis.Node ??= {
    TEXT_NODE: 3,
    ELEMENT_NODE: 1,
  };

  const editor = {
    childNodes: [
      { nodeType: Node.TEXT_NODE, textContent: "Hello\n" },
      {
        nodeType: Node.ELEMENT_NODE,
        localName: "span",
        classList: {
          contains: (className) => className === "text-color",
        },
        style: {
          color: "var(--brand-600)",
          getPropertyValue: () => "",
        },
        childNodes: [{ nodeType: Node.TEXT_NODE, textContent: "World" }],
      },
    ],
  };

  expect(serializeTextChildren(editor)).toEqual([
    { text: "Hello\n" },
    {
      text: "World",
      marks: {
        color: "var(--brand-600)",
      },
    },
  ]);
});
