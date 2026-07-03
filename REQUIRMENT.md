# Quill CMS Editor Requirements — Concise Fresh Project Plan

## 1. Purpose

Build a fresh Lit-based CMS editor project using Quill 2 for rich text editing.

The editor must support:

- A complete CMS editor application.
- A reusable library that another app can configure and extend.
- Block-based page editing, not one large rich-text document.

Core principle:

> The CMS owns structure. Quill owns only rich text.

Quill must not become the page model, layout model, group model, table model, or toolbar state model. Quill is only used inside text-based blocks.

---

## 2. Technical Foundation

Use:

- Lit 3 web components.
- Vite+ for development, testing, linting, formatting, and builds.
- Quill 2 as the only rich-text editing engine.
- JavaScript ES modules.
- Versioned JSON page data.
- Framework-independent custom elements.

Required commands:

```sh
vp install
vp dev
vp check
vp test
vp build
```

Do not use:

- React.
- Vue.
- ProseMirror.
- TipTap.
- Slate.
- `document.execCommand`.
- `innerHTML` outside the approved Quill import/export boundary.

---

### 2.1 Folder Structure Guide

The current project is organized into a demo application, a reusable editor plugin, and
project-specific customizations:

```txt
web-component-cms/
├── examples/                    # Examples that consume the reusable plugin API
├── public/                      # Files served unchanged at the site root
│   ├── fonts/                   # Public font files and font license information
│   └── images/                  # Public logos, illustrations, and raster images
├── src/
│   ├── assets/                  # Assets imported by JavaScript or CSS
│   │   ├── data/                # Versioned page JSON and migration fixtures
│   │   └── svg/                 # SVG files handled by the build
│   ├── customize/               # Application-specific editor configuration and UI
│   │   ├── config/              # Option lists: fonts, icons, borders, links, and fits
│   │   ├── group-pickers/       # Project-specific group picker dialogs
│   │   ├── groups/              # Concrete page-section web components
│   │   └── layout-designs/      # Layout previews used by picker UI
│   ├── plugin/                  # Reusable CMS editor implementation and public API
│   │   ├── components/
│   │   │   ├── blocks/          # Content blocks and block-specific styles/helpers
│   │   │   ├── dialogs/         # Shared dialogs
│   │   │   ├── group-pickers/   # Reusable picker base classes
│   │   │   ├── groups/          # Reusable group base classes and ordering
│   │   │   ├── lists/           # Reusable list behaviors and list components
│   │   │   └── toolbars/        # Shared toolbars and formatting controls
│   │   ├── editor/              # Controller, commands, history, selection, and output
│   │   ├── features/            # Feature entry points and registry wiring
│   │   ├── registries/          # Pure block, command, formatter, group, and list registries
│   │   ├── schema/              # Page defaults, normalization, validation, and schema
│   │   ├── utils/               # Small shared utilities
│   │   └── index.js             # Reusable plugin entry point and public exports
│   ├── styles/                  # Global reset, font, color, and layout styles
│   ├── main.js                  # Demo application entry point
│   └── style.css                # Demo application's top-level stylesheet
├── index.html                   # Main editor demo page
├── package-consumer.html        # Browser fixture for package-consumer verification
├── migration-baseline.html      # Migration comparison fixture
├── public/page.ts               # Standalone public page data/module
├── vite.config.js               # Vite+ configuration
└── package.json                 # Package metadata, dependencies, and scripts
```

Generated directories such as `node_modules/`, `dist/`, and Vite cache directories are
not source folders and must not be committed.

#### Placement rules

- Put reusable editor behavior in `src/plugin/`; do not add project branding or page-specific
  layouts there.
- Put concrete site sections in `src/customize/groups/<group-name>/`. Keep the component and
  its optional `<group-name>.style.js` file together, then import and register it from
  `src/customize/groups/index.js`.
- Put reusable block implementations in `src/plugin/components/blocks/<block-name>/`, export
  them through `src/plugin/components/blocks/index.js`, and register their behavior in the
  matching `src/plugin/features/<feature-name>/index.js`.
- Put toolbar controls in `src/plugin/components/toolbars/controls/`. Feature-owned Quill
  adapters and formatters may use a nested feature folder such as `controls/quill/`.
- Keep registries free of component imports and application defaults. Registration belongs in
  feature or customization entry points.
- Put serializable page rules in `src/plugin/schema/`, editor state coordination in
  `src/plugin/editor/`, and stateless cross-feature helpers in `src/plugin/utils/`.
- Put files that must retain their exact public path in `public/`. Put files referenced by
  module imports in `src/assets/`.
- Keep `src/main.js` small: it should load global styles, register the plugin, load initial
  page data, and initialize the editor.
- Place verification files beside the code they test when unit tests are added. Use a top-level
  browser fixture only when a real HTML page is required.

#### Lit component structure

Every Lit component must have its own kebab-case folder. The component file and optional style
file must repeat the folder name:

```txt
<component-name>/
├── <component-name>.js
└── <component-name>.style.js
```

For example, a list component must use:

```txt
src/plugin/components/lists/news-list/
├── news-list.js
└── news-list.style.js
```

Block components must use the same format. Use the complete component name, including the
`-block` suffix:

```txt
src/plugin/components/blocks/image-block/
├── image-block.js
└── image-block.style.js
```

Rules:

- Use `<name>/<name>.js` for the Lit component.
- Use `<name>/<name>.style.js` for that component's Lit CSS.
- Name a block folder `<name>-block/`; do not shorten it to `<name>/`.
- Import the style module directly from the component file.
- Use the singular `.style.js` suffix; do not create new `.styles.js` files.
- Keep helpers in the same folder only when they belong exclusively to that component.
- Use `index.js` at a component collection or feature boundary for exports and registration,
  not as the component implementation filename.

#### Current dependency flow

```txt
index.html
  └── src/main.js
      └── src/plugin/index.js
          ├── src/plugin/features/
          ├── src/plugin/editor/
          └── src/customize/ (current configuration and group registration)
```

`src/plugin/` currently imports option lists and group registrations from `src/customize/`.
Until the public configuration API in section 15 is implemented, treat these folders as one
build unit. New reusable modules should still avoid adding further dependencies on
`src/customize/` so the plugin can later become an independent package.

---

## 3. Build Strategy

Build piece by piece.

Do not build all blocks at once.

Priority order:

1. Project foundation.
2. Quill text block.
3. Basic group system.
4. Editor controller and selection tracking.
5. Shared toolbar for Quill text.
6. Serialization and history.
7. Picker system.
8. Image block.
9. Icon block and Google icon-font configuration.
10. Button block and custom button-design configuration.
11. Table block with restricted Quill cell editors.
12. Public configuration and package exports.
13. Final tests and cleanup.

Each phase must pass:

```sh
vp check
vp test
vp build
```

---

## 4. Important Architecture Rules

### 4.1 Lit and Quill ownership

Lit must own only the empty Quill mount element.

Quill owns everything inside that element.

```js
render() {
  return html`<div class="quill-container" part="editor"></div>`;
}

firstUpdated() {
  const container = this.renderRoot.querySelector(".quill-container");
  this.quill = new Quill(container, this.quillOptions);
}
```

Rules:

- Create Quill exactly once in `firstUpdated()`.
- Never render Quill content through a Lit template.
- Never bind `.innerHTML`, Delta, or text as children of the Quill container.
- Do not conditionally render the Quill container.
- Reactive updates may call Quill APIs but must not replace the container.
- Disconnect Quill event listeners in `disconnectedCallback()`.
- Guard external value sync so local typing does not reload stale content and reset the caret.

### 4.2 Shadow DOM and selection

Editable groups and editable Quill blocks should live in a light-DOM editing canvas.

Shadow DOM is allowed for:

- Toolbars.
- Dialogs.
- Picker UI.
- Non-editable controls.

Avoid putting Quill inside nested shadow roots.

If it cannot be avoided, create one compatibility module:

```txt
src/blocks/text/quill-selection-bridge.js
```

This module may patch Quill selection behavior, but it must have a browser regression test.

Required regression:

```txt
typed:  H → He → Hel → Hell → Hello
caret:  1 → 2  → 3   → 4    → 5
```

### 4.3 Light-DOM style boundary

Light DOM does not provide CSS isolation. Host-page selectors can match Quill elements, and
inherited host styles can change typography, spacing, colors, lists, links, and form controls.
Normal external declarations do not override a Quill `style` attribute for the same property,
but an external `!important` declaration can override it.

This project accepts that tradeoff to preserve reliable Quill selection. It must establish a
documented style boundary rather than claiming full isolation.

Required structure:

```html
<page-editor>
  <group-order data-editor-canvas>
    <!-- Groups and Quill blocks are rendered here. -->
  </group-order>
</page-editor>
```

Editor CSS must be scoped from the public host and canvas:

```css
page-editor [data-editor-canvas] {
  color: var(--editor-text-color, #111);
  font-family: var(--editor-font-family, sans-serif);
  font-size: var(--editor-font-size, 16px);
  line-height: var(--editor-line-height, 1.5);
}

page-editor [data-editor-canvas] .ql-editor {
  box-sizing: border-box;
  min-height: 1em;
}
```

Rules:

- Add `data-editor-canvas` to the internal `<group-order>`.
- Scope every editor-owned global selector under `page-editor`.
- Explicitly establish inherited typography, color, direction, and box-sizing at the canvas
  boundary.
- Keep supported theme values in CSS custom properties on `<page-editor>`.
- Do not use `!important` in editor CSS except for a documented browser or Quill compatibility
  fix.
- Do not attempt to defeat arbitrary host `!important` rules with a specificity arms race.
- Document that host applications must not target `page-editor` descendants or `.ql-*` classes.
- Quill-generated inline formats remain the source of truth for formatted content; editor CSS
  supplies defaults only.
- Sanitize style values during import and serialization regardless of CSS isolation.
- Add a browser fixture with hostile host selectors for `p`, `a`, `ul`, `ol`, `button`, and
  `.ql-editor`, then verify computed editor styles and caret behavior.
- If an embedding environment requires protection from arbitrary hostile CSS, use an iframe
  boundary. Do not move Quill into nested shadow roots solely for style isolation.

---

## 5. Page Data

Use fresh versioned page data only.

No legacy v1 migration is required.

Base schema:

```json
{
  "version": 1,
  "groups": [
    {
      "id": "group-1",
      "type": "paragraph",
      "sort": 0,
      "style": {},
      "blocks": [
        {
          "id": "text-1",
          "type": "rich-text",
          "delta": {
            "ops": [{ "insert": "Hello world\n" }]
          },
          "html": "<p>Hello world</p>"
        }
      ]
    }
  ]
}
```

Canonical empty Delta:

```json
{
  "ops": [{ "insert": "\n" }]
}
```

Rules:

- `delta` is the canonical editable value.
- `html` is optional derived output for public rendering.
- Empty text must always normalize to the canonical empty Delta.
- Serialization order must be stable.
- IDs must stay stable during save/load.

---

## 6. ID Rules

- Every group must have a stable `id`.
- Every block must have a stable `id`.
- IDs must not change during serialization/deserialization.
- New IDs use `crypto.randomUUID()` when available.
- Tests may inject deterministic ID generators.
- Duplicate IDs must fail validation during development.

---

## 7. Block Contract

Every block must provide:

```js
class ContentBlock extends LitElement {
  init(data) {}
  toJSON() {}
  getSelectionFormat() {}
  captureSelection(options) {}
  restoreSelection() {}
  clearSelection() {}
}
```

Every block must:

- Emit composed, bubbling change events.
- Serialize deterministic JSON.
- Restore from JSON.
- Declare toolbar capabilities.
- Work with editor-level history.

---

## 8. Quill Text Block

Public element:

```html
<rich-text-block></rich-text-block>
```

Internally it must use:

- Quill 2.
- Quill Delta.
- No legacy custom `contenteditable` formatting code.

Required formats:

| CMS action   | Quill format/value                                 |
| ------------ | -------------------------------------------------- |
| Paragraph    | `header: false`                                    |
| H1           | `header: 1`                                        |
| H2           | `header: 2`                                        |
| H3           | `header: 3`                                        |
| Bold         | `bold`                                             |
| Italic       | `italic`                                           |
| Underline    | `underline`                                        |
| Ordered list | `list: "ordered"`                                  |
| Bullet list  | `list: "bullet"`                                   |
| Align        | `align: false`, `"center"`, `"right"`, `"justify"` |
| Text color   | `color`                                            |
| Highlight    | `background`                                       |
| Link         | `link`                                             |

Optional later:

- Font family.
- Font size.

---

## 9. Toolbar Architecture

Use one shared external toolbar.

Required application HTML structure:

```html
<page-editor></page-editor>
```

`<page-editor>` must render this internal light-DOM structure with Lit:

```js
render() {
  return html`
    <group-order
      @selection-format-change=${this.handleEditorEvent}
      @editor-change=${this.handleEditorEvent}
    ></group-order>

    <editor-toolbar
      @format-command=${this.handleEditorEvent}
      @quill-format-command=${this.handleEditorEvent}
    >
      <group-format-toolbar></group-format-toolbar>
      <format-toolbar></format-toolbar>
    </editor-toolbar>
  `;
}

createRenderRoot() {
  return this;
}
```

Rules:

- `<page-editor>` is the public editor shell and owns editor-level state and coordination.
- Host HTML must contain only `<page-editor></page-editor>`; consumers must not construct or
  depend on its internal editor elements.
- `<page-editor>` must render `<group-order>` and `<editor-toolbar>` as direct children.
- Render the editing canvas in light DOM so Quill selection remains compatible with browser
  selection APIs.
- `<group-order>` owns the editable group collection.
- `<editor-toolbar>` is the visual container for editor toolbars; it does not own editor state.
- `<group-format-toolbar>` must appear before `<format-toolbar>`.
- Bind child events with Lit `@event` expressions so Lit manages listener lifecycle.
- Use imperative `addEventListener()` only for non-template event sources such as Quill,
  `window`, or `document`, and remove those listeners during disconnection.
- Child components must send state changes upward with bubbling, composed custom events.
- Send state and configuration downward through reactive Lit properties.
- Route targeted formatting commands through the editor controller or explicit component
  methods; do not build a global event bus for parent-to-child state.
- `init()` must wait for the first Lit render before restoring page data.
- Do not expose `<group-order>`, toolbar elements, or internal selectors as public API.

Do not use Quill's built-in toolbar module for the shared CMS toolbar.

Rules:

- Initialize each Quill block with `toolbar: false`.
- Track the active Quill block in `EditorController`.
- Toolbar controls emit `quill-format-command`.
- EditorController sends the command only to the active Quill block.
- The active block applies commands through `QuillFormatAdapter`.
- Toolbar state must come from `quill.getFormat(range)`.

Command event:

```js
new CustomEvent("quill-format-command", {
  detail: {
    format: "bold",
    value: true,
    scope: "inline",
  },
  bubbles: true,
  composed: true,
});
```

Required controls for phase 1:

- Paragraph / H1 / H2 / H3.
- Bold.
- Italic.
- Underline.
- Ordered list.
- Bullet list.
- Alignment.
- Link.
- Clear formatting.

Add color/highlight after the basic toolbar is stable.

---

## 10. History

Use editor-level snapshot history.

Rules:

- Typing changes are debounced.
- Toolbar commands create immediate history entries.
- Group add/delete/reorder creates immediate history entries.
- Undo and redo restore the full page snapshot.
- Quill internal history must be disabled or ignored.
- Do not store selection state in page JSON.

---

## 11. Groups

Groups are layout sections composed from blocks.

Start with only:

- Paragraph group.
- Hero group.

Example:

```js
class ParagraphGroup extends GroupBase {
  render() {
    return html` <rich-text-block block-id="body"></rich-text-block> `;
  }
}
```

Groups must support:

- Stable ID.
- Sort order.
- Add.
- Remove.
- Reorder.
- Default block data.
- Serialization.

Add more groups later.

### 11.1 Group order system

Use one `<group-order>` element as the owner of the ordered group collection. Group toolbar
controls request operations; they must not directly insert, remove, or reorder group DOM
elements.

Required control flow:

| Toolbar action | Request event          | Required detail              |
| -------------- | ---------------------- | ---------------------------- |
| Move up/down   | `move-group-request`   | `{ group, offset: -1 \| 1 }` |
| Add below      | `add-group-request`    | `{ after: group }`           |
| Delete         | `delete-group-request` | `{ group }`                  |
| Picker result  | `group-select`         | `{ type }`                   |

`<group-order>` must:

- Listen for all group-order request events.
- Open the registered group picker for add requests.
- Create selected groups from the group registry with a stable unique ID.
- Insert a new group after the requesting group, or at the beginning when the page is empty.
- Initialize a new group from its registered defaults.
- Focus the first editable block after insertion.
- Require confirmation before deleting a group.
- Prevent moves beyond the first and last positions.
- Keep DOM order and each group's numeric `sort` value synchronized after every operation.
- Normalize `sort` values to contiguous zero-based integers.
- Emit one bubbling, composed `editor-change` event after a successful mutation.
- Preserve group IDs while saving, loading, moving, undoing, and redoing.

Every concrete group must render the shared group-order controls supplied by `GroupBase`.
The controls must provide accessible labels for move up, move down, add below, and delete.
Controls that cannot run, such as moving the first group up, must be disabled.

---

## 12. Picker System

Start simple.

First version only needs:

- Open group picker.
- Show available group types.
- Insert selected group.
- Focus first editable block after insertion.

Advanced filtering and previews can be added later.

### 12.1 External image picker API

The image picker must not fetch or own the application's image library. The host application
provides the available image list through the public `<page-editor>` API.

Required API:

```js
const editor = document.querySelector("page-editor");

editor.setImageList(imageList);
editor.setImageBaseUrl("/uploads/");

const snapshot = editor.getImageList();

editor.addEventListener("image-list-change", (event) => {
  console.log(event.detail.images);
});
```

`setImageList()` replaces the complete available image list and returns the normalized
snapshot. `getImageList()` returns a copy that external code cannot use to mutate internal
state.

Canonical image-list data:

```json
{
  "version": 1,
  "images": [
    {
      "id": "0fcecf4f-6a6a-4a24-9be6-19bffee5d3da",
      "url": "/uploads/0fcecf4f-6a6a-4a24-9be6-19bffee5d3da.jpeg",
      "filename": "0fcecf4f-6a6a-4a24-9be6-19bffee5d3da.jpeg",
      "originalName": "hero.jpeg",
      "mimeType": "image/jpeg",
      "size": 149369,
      "width": 1920,
      "height": 1080,
      "alt": "Homepage hero"
    }
  ]
}
```

Required fields:

- Image-list `version`.
- `images` array.
- Unique image `id`.
- Image `url`.
- Image `filename`.

Optional fields:

- `originalName`.
- `mimeType`.
- `size` in bytes.
- Pixel `width` and `height`.
- Default `alt` text.

Do not support legacy array-only input or alternative URL keys such as `src`, `path`, or
`imageUrl`. External applications must adapt their response to this canonical structure before
calling `setImageList()`.

The editor must dispatch these bubbling, composed events:

| Event                | When                                                 | Detail                                  |
| -------------------- | ---------------------------------------------------- | --------------------------------------- |
| `image-list-request` | The picker opens and requests the latest host list   | `{ respond(imageList), currentImages }` |
| `image-list-change`  | A valid external list replaces the current list      | `{ version, images }`                   |
| `image-select`       | The user selects an image for the active image block | `{ image, blockId }`                    |

The host may respond synchronously or asynchronously:

```js
editor.addEventListener("image-list-request", async (event) => {
  const response = await loadImages();
  event.detail.respond(response);
});
```

Rules:

- Validate the complete list before replacing the current list.
- Reject unsupported versions, duplicate IDs, invalid dimensions, and missing required fields.
- Restrict image URLs to approved application URLs and the allowed protocols.
- Treat image-list state as external catalog state; do not serialize it into page JSON.
- Do not add image-list replacements to editor undo/redo history.
- Emit `image-list-change` only after successful normalization and replacement.
- Emit one `image-select` event after selection and store the selected `id`, `url`, and `alt`
  in the image block.
- Preserve the last valid list when a new list fails validation.
- Remove external listeners in the host application; the editor must remove any listeners it
  registers internally when disconnected.

---

## 13. Built-in Blocks Roadmap

Build in this order:

### Phase 1

- Rich text block.
- Paragraph group.
- Hero group.

### Phase 2

- Image block.
- Icon block.

### Phase 3

- Button block.
- Table block.

### Phase 4

- Restricted Quill cell editor for table cells.

Do not build table first.

---

## 14. Table Decision

Keep table as a custom CMS block.

Do not force full table editing into Quill.

Table block should use its own data model:

```json
{
  "id": "table-1",
  "type": "table",
  "cells": [
    [
      {
        "delta": {
          "ops": [{ "insert": "Plan\n" }]
        },
        "header": true
      }
    ]
  ],
  "options": {
    "headerRow": true,
    "headerColumn": false
  }
}
```

Table cells may use restricted Quill later.

Default disabled inside table cells:

- Headings.
- Lists.
- Images.
- Videos.

---

## 15. Configuration API

Applications must be able to configure the editor without editing core files.

Example:

```js
import { createEditorConfig } from "@cms/editor/config";

export const config = createEditorConfig({
  colors: [],
  iconFonts: [],
  buttonDesigns: [],
  imageFits: [],
  table: {
    rows: 3,
    columns: 3,
    cellFormats: ["bold", "italic", "underline", "color", "link"],
  },
});
```

Configuration must be validated once at startup.

### 15.1 Google icon font configuration

The fresh project must use configured Google icon fonts for the icon picker. Do not embed an
internal SVG catalog in the reusable editor.

The configuration package must export `defineGoogleIconFonts()` so the host application can
declare the allowed font sets and icon names:

```js
import { createEditorConfig, defineGoogleIconFonts } from "@cms/editor/config";

export const googleIconFonts = defineGoogleIconFonts([
  {
    id: "material-symbols-rounded",
    name: "Material Symbols Rounded",
    family: "Material Symbols Rounded",
    className: "material-symbols-rounded",
    stylesheetUrl:
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
    defaults: {
      fill: 0,
      weight: 400,
      grade: 0,
      opticalSize: 24,
    },
    icons: [
      { name: "Home", glyph: "home" },
      { name: "Search", glyph: "search" },
      { name: "Menu", glyph: "menu" },
      { name: "Close", glyph: "close" },
      { name: "Arrow forward", glyph: "arrow_forward" },
    ],
  },
]);

export const config = createEditorConfig({
  iconFonts: googleIconFonts,
});
```

Font-set fields:

- `id`: stable unique identifier stored in page data.
- `name`: human-readable font-set name shown by the picker.
- `family`: exact CSS `font-family` value.
- `className`: optional CSS class used by the Google font.
- `stylesheetUrl`: HTTPS Google Fonts stylesheet URL.
- `defaults`: optional Material Symbols axis defaults.
- `icons`: explicit list of icons available to editors.

Icon fields:

- `name`: human-readable picker label.
- `glyph`: exact Google icon-font ligature text.

The icon picker must:

- Display only icons declared in `iconFonts`; do not expose the entire Google catalog.
- Support multiple configured font sets.
- Group or filter icons by font-set `name`.
- Search case-insensitively by icon `name` and `glyph`.
- Render previews with the configured font family and axis defaults.
- Show a clear empty state when no icon fonts or icons are configured.
- Keep keyboard navigation and visible focus states.
- Use the icon `name` for button labels and accessibility text.
- Emit a bubbling, composed `icon-select` event with
  `{ fontId, glyph, name, blockId }`.

Canonical icon block data:

```json
{
  "id": "icon-1",
  "type": "icon",
  "fontId": "material-symbols-rounded",
  "glyph": "home",
  "name": "Home",
  "style": {
    "fill": 0,
    "weight": 400,
    "grade": 0,
    "opticalSize": 24,
    "fontSize": "24px",
    "color": "#111111"
  }
}
```

Rules:

- Store `fontId` and `glyph` as the canonical icon identity; do not store rendered HTML.
- Validate unique font IDs and unique glyphs within each font set.
- Reject missing names, missing glyphs, invalid axis values, and non-HTTPS stylesheet URLs.
- Load each configured stylesheet at most once.
- Do not allow configuration values to inject HTML, CSS rules, or arbitrary class lists.
- Preserve a saved icon when configuration order changes.
- Report a missing configured font or glyph without silently replacing the saved icon.
- The host application is responsible for allowing Google Fonts through its Content Security
  Policy and may preload the configured stylesheet.

### 15.2 Custom button picker configuration

The reusable editor must not hard-code button classes or design names. The configuration
package must export `defineButtonDesigns()` so the host application can provide an allowlisted
set of button designs:

```js
import { createEditorConfig, defineButtonDesigns, defineGoogleIconFonts } from "@cms/editor/config";

export const googleIconFonts = defineGoogleIconFonts([
  // Host-defined Google icon fonts and glyphs.
]);

export const buttonDesigns = defineButtonDesigns([
  {
    id: "primary",
    name: "Primary",
    classNames: ["button", "button--primary"],
    icon: {
      enabled: true,
      positions: ["start", "end"],
      allowIconOnly: true,
    },
  },
  {
    id: "text-link",
    name: "Text link",
    classNames: ["button", "button--text"],
    icon: {
      enabled: false,
    },
  },
]);

export const config = createEditorConfig({
  iconFonts: googleIconFonts,
  buttonDesigns,
});
```

Button-design fields:

- `id`: stable unique design identifier stored in page data.
- `name`: human-readable name shown in the button picker.
- `classNames`: ordered list of host CSS class names applied to the rendered button.
- `icon.enabled`: whether the design accepts an optional configured icon.
- `icon.positions`: allowed icon positions: `start` and/or `end`.
- `icon.allowIconOnly`: whether the design permits a button without a visible text label.

The button picker must:

- Display only designs declared in `buttonDesigns`.
- Preview each design using its configured class names.
- Apply class names in configuration order without copying them into page JSON.
- Show the icon picker only when the selected design enables icons.
- Use only icons declared by the Google icon-font configuration in section 15.1.
- Show only icon positions allowed by the selected design.
- Support text-only, text-with-icon, and icon-only buttons.
- Preserve the selected icon when its position changes.
- Require an accessible label for every icon-only button.
- Emit bubbling, composed `button-design-select` and `button-icon-change` events.

Canonical button block data:

```json
{
  "id": "button-1",
  "type": "button",
  "designId": "primary",
  "label": "Continue",
  "accessibleLabel": "Continue to payment",
  "href": "/payment",
  "target": "_self",
  "icon": {
    "fontId": "material-symbols-rounded",
    "glyph": "arrow_forward",
    "name": "Arrow forward",
    "position": "end",
    "iconOnly": false
  }
}
```

Rules:

- Store `designId`, not configured class names, in page data.
- Resolve class names from the active configuration when rendering.
- Validate every class name as one CSS class token; reject whitespace, markup, and CSS syntax.
- Validate unique design IDs and require non-empty design names.
- Reject icon positions that the selected design does not allow.
- When `iconOnly` is `true`, require `accessibleLabel` and hide the visible `label`.
- When no icon is selected, omit `icon` or store it as `null`.
- Preserve saved button data when configuration order changes.
- Report missing designs, fonts, or glyphs without silently substituting another value.
- Changing button configuration must not mutate already serialized page data.

---

## 16. Package Exports

Required exports:

```json
{
  "exports": {
    ".": "./src/index.js",
    "./config": "./src/config/index.js",
    "./blocks": "./src/blocks/index.js",
    "./groups": "./src/groups/index.js",
    "./pickers": "./src/pickers/index.js",
    "./toolbars": "./src/toolbars/index.js",
    "./schema": "./src/schema/index.js",
    "./styles": "./src/styles/index.css"
  }
}
```

---

## 17. Security and Accessibility

Minimum requirements:

- Sanitize imported/exported HTML.
- Restrict URL protocols to `http:`, `https:`, `mailto:`, and `tel:`.
- Use accessible buttons.
- Use `aria-pressed` for toggle buttons.
- Preserve focus after toolbar and group operations.
- Require image alt text when image block is added.
- Do not use unsafe `innerHTML`.

---

## 18. Testing

### Unit tests

Required:

- Registry duplicate handling.
- Schema validation.
- Quill Delta serialization.
- History undo/redo.
- Group add/remove/reorder.
- Toolbar command mapping.

### Browser tests

Required:

- Typing `Hello` produces `Hello`.
- Caret moves from 1 to 5 while typing.
- Toolbar bold/italic/underline work.
- Heading command works.
- Save/load round trip works.
- Undo/redo works after typing and toolbar formatting.

---

## 19. AI Implementation Steps

### Step 1: Create project foundation

Build:

- Vite+ project.
- Lit 3 setup.
- Quill 2 setup.
- Basic exports.
- Empty `<cms-editor>` shell.

Run:

```sh
vp check
vp test
vp build
```

Stop after this step.

---

### Step 2: Build `<rich-text-block>`

Build:

- Quill mount element.
- Quill initialization in `firstUpdated()`.
- `toJSON()`.
- `init(data)`.
- `text-change` event.
- Basic Delta save/load.
- Canonical empty Delta handling.

Test:

- Render block.
- Type text.
- Save Delta.
- Restore Delta.

Stop after this step.

---

### Step 3: Add basic groups

Build:

- `GroupBase`.
- `<group-order>` collection owner.
- Shared group toolbar controls for add, delete, move up, and move down.
- Group request events and registry-based insertion.
- Paragraph group.
- Hero group.
- Stable group IDs and contiguous `sort` normalization.
- Group serialization.
- Group restore.

Test:

- Add a group at the beginning of an empty page.
- Add a group below the selected group.
- Remove a group after confirmation.
- Cancel group removal without changing the page.
- Move a group up and down from its toolbar controls.
- Disable invalid first/last move controls.
- Keep DOM order, serialized order, and zero-based `sort` values synchronized.
- Preserve group IDs through add, move, save, and load.
- Record add, remove, and move operations in editor history.

Stop after this step.

---

### Step 4: Add `EditorController`

Build:

- Active block tracking.
- Selection tracking.
- Block change handling.
- Group change handling.

Test:

- Click text block.
- Active block updates.
- Selection event is received.

Stop after this step.

---

### Step 5: Add shared Quill toolbar

Build:

- Basic toolbar UI.
- Quill command event.
- `QuillFormatAdapter`.
- Bold, italic, underline.
- Paragraph/H1/H2/H3.
- Lists.
- Alignment.
- Link.
- Clear formatting.

Test:

- Toolbar changes selected text.
- Toolbar works with collapsed selection.
- Toolbar state follows selection.

Stop after this step.

---

### Step 6: Add editor history

Build:

- Snapshot history.
- Debounced typing history.
- Immediate toolbar history.
- Undo.
- Redo.

Test:

- Undo typing.
- Redo typing.
- Undo formatting.
- Redo formatting.

Stop after this step.

---

### Step 7: Add simple picker

Build:

- Group registry.
- Picker dialog.
- Insert paragraph group.
- Insert hero group.
- Focus first editable block.

Test:

- Add groups from picker.
- Save/load inserted groups.

Stop after this step.

---

### Step 8: Add image block

Build:

- Public `setImageList()`, `getImageList()`, and `setImageBaseUrl()` APIs.
- Canonical image-list normalization and validation.
- `image-list-request`, `image-list-change`, and `image-select` events.
- Image picker loading, empty, error, and populated states.
- Image source.
- Selected image asset ID.
- Alt text.
- Fit option.
- Link option.
- Serialization.

Test:

- Inject an image list from the host application.
- Request and receive a list asynchronously when the picker opens.
- Notify external listeners after the list changes.
- Reject invalid lists and preserve the last valid list.
- Select an externally provided image.
- Add image block.
- Edit image data.
- Save/load image block.

Stop after this step.

---

### Step 9: Add Google icon-font picker and icon block

Build:

- Exported `defineGoogleIconFonts()` configuration helper.
- Google font-set and icon-list validation.
- Stylesheet loading with duplicate-load protection.
- Font-set filter and icon-name search.
- Icon picker keyboard navigation.
- Icon block rendering and serialization.
- `icon-select` event.

Test:

- Configure one and multiple Google icon fonts.
- Render only declared icons.
- Search icons by human-readable name and glyph.
- Select an icon and receive the exported event detail.
- Reject duplicate font IDs, duplicate glyphs, and invalid stylesheet URLs.
- Load each font stylesheet only once.
- Save/load an icon without changing `fontId` or `glyph`.
- Report a saved icon that is missing from the current configuration.

Stop after this step.

---

### Step 10: Add configurable button picker and button block

Build:

- Exported `defineButtonDesigns()` configuration helper.
- Button-design and class-name validation.
- Configured design previews.
- Label, accessible label, link, and target.
- Optional configured Google icon.
- Start/end icon position controls.
- Icon-only mode.
- Button rendering and serialization.
- `button-design-select` and `button-icon-change` events.

Test:

- Configure multiple custom button designs and class names.
- Render only configured designs.
- Reject duplicate IDs and unsafe class names.
- Add text-only and text-with-icon buttons.
- Move an icon between start and end positions.
- Create an icon-only button with an accessible label.
- Reject icon-only buttons without an accessible label.
- Disable icons for designs that do not support them.
- Save/load without serializing configured class names.
- Report missing designs, fonts, and glyphs.

Stop after this step.

---

### Step 11: Add table block

Build:

- Custom table model.
- Rows.
- Columns.
- Header row.
- Header column.
- Serialization.

Do not add Quill cell editor yet.

Test:

- Add row.
- Add column.
- Remove row.
- Remove column.
- Save/load table.

Stop after this step.

---

### Step 12: Add restricted Quill table cells

Build:

- Table cell editor.
- Restricted formats.
- Cell Delta serialization.

Test:

- Edit cell text.
- Save/load cell Delta.
- Ensure headings/lists are disabled.

Stop after this step.

---

### Step 13: Final cleanup

Do:

- Remove unused code.
- Confirm no `execCommand`.
- Confirm no unsafe `innerHTML`.
- Confirm public exports.
- Run all tests.

Required final commands:

```sh
vp check
vp test
vp build
```

---

## 20. Acceptance Criteria

The project is ready when:

- Quill is the only rich-text engine.
- Text block works with Delta save/load.
- Groups can be added, removed, reordered, saved, and restored.
- Shared toolbar works with the active Quill block.
- History works for typing, toolbar formatting, and group changes.
- Image, button, icon, and table blocks serialize and restore.
- Table cells use restricted Quill editors.
- Public configuration works without editing core source files.
- Package exports work.
- `vp check`, `vp test`, and `vp build` pass.
