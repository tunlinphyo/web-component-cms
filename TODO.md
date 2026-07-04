# TODO

## Split rich text into two components

Refactor the current rich-text block into two separate components with different editing
behaviors and formatter capabilities.

### 1. Paragraph rich-text component

- Keep the current rich-text editor's `p` behavior, including its paragraph/list DOM
  normalization, multiline editing, selection handling, serialization, and existing formatting
  behavior.
- Replace the current reversed keyboard behavior with standard paragraph editing:
  - `Enter` creates a new `<p>` paragraph.
  - `Shift+Enter` inserts a line break inside the current paragraph.
- Make this component paragraph-only. It must not support `h1`, `h2`, or `h3`, and the toolbar
  must not show `element-type-selector` when this component is selected.
- Preserve every other formatter currently supported by the rich-text block:
  font family, font size, text color and palette, bold, italic, underline, ordered list,
  unordered list, alignment, highlight/mark style, link, and link target.

### 2. Inline-text component

- Add a separate `inline-text` component that supports `element-type-selector` with `p`, `h1`,
  `h2`, and `h3`.
- This component must support only these formatter capabilities:
  element type, bold, italic, underline, link, and alignment (left, center, right, and justify).
  All other rich-text formatters must be unavailable when this component is selected.
- In this component, `p` must use the same editing and content model as `h1`, `h2`, and `h3`.
  It must be a flat, single text element and must not use the current rich-text `p` behavior that
  creates or normalizes nested paragraph blocks.
- `Enter` inserts a line break while keeping the content in the same selected element type.
  `Shift+Enter` is unsupported and must not insert a paragraph or line break.
- Changing the element type between `p`, `h1`, `h2`, and `h3` must preserve the content,
  selection/caret where possible, inline formatting, link data, and alignment. Changing to `p`
  must not convert the content to the paragraph-rich-text component's multiline paragraph model.

### Integration and acceptance criteria

- Register both components as distinct block types so groups can choose the correct one.
- Drive toolbar visibility and command availability through each block's registered capabilities;
  do not add component-specific toolbar conditionals.
- Serialize enough block identity/type information to restore the correct component and selected
  element type when loading saved page data.
- Existing paragraph-rich-text content must continue to load and serialize without data loss.
- Add tests covering each component's capability set, element-type changes, `p` DOM/content
  behavior, Enter/Shift+Enter handling, serialization round trips, and isolation from unsupported
  formatter commands.
