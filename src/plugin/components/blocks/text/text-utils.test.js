import { expect, test } from "vite-plus/test";
import { serializeHtml } from "./text-utils.js";

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
