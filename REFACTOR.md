# Refactor Proposal

## Implementation Status

- [x] Step 1: Schema, defaults, validators, and registries.
- [x] Step 2: Editor controller extraction for selection state, command dispatch, and toolbar notification.
- [x] Step 3: Serializer layer and history snapshot foundation.
- [x] Step 4: Feature modules for rich text, button, image, group, and list registrations.
- [x] Step 5: Cleanup and verification.

The refactor now has pure registries, feature-owned registrations, controller-owned editor state,
serializer/history modules, and registry-backed editor selectors. Remaining hardcoded selectors are
mostly component-local template/style details rather than editor/controller routing.

## Goals

The editor is now doing enough that a small file-by-feature cleanup will not be enough. The next architecture should make these things explicit:

- A page data schema that is versioned and independent from DOM implementation details.
- A registry for group, block, block-list, and formatter capabilities.
- A single editor state/controller layer that owns selection, commands, serialization, and history.
- UI components that mostly render and emit typed commands.
- Reusable list behavior for navs, FAQs, cards, social links, gallery items, and similar future features.
- Validation paths so invalid saved JSON fails clearly instead of being guessed from DOM shape.

The main risk today is that behavior is spreading through custom elements, hardcoded selectors, and special cases in `rich-text-editor.js`. That works for a small editor, but each new feature now requires touching several unrelated files.

## Requirement to Implement later

- News list block that can add and remove like navs. and link can add at each block but optional
- Add need table block that can add remove table role and columns and defualt table header row at top.
- Q and A blocks that can add remvoe edit.
- Each group can create a unique ID that can link with hash form button.

## Current Pain Points

`rich-text-editor.js` is becoming a central switchboard. It knows selectors for all groups and blocks, tracks active block/group/list state, routes all toolbar commands, and performs toolbar notification. This makes every new component type require editor changes.

Groups and blocks serialize themselves directly from DOM. That couples saved JSON shape to current DOM nesting. The new `navs.children` shape is a good direction, but it also shows the need for schema-level serializers instead of one-off group overrides.

Formatter controls are manually imported and manually listed. A new command needs a formatter element, toolbar handling, editor command handling, and target block methods.

List behavior is reusable, but currently still lives under `block-group` and is only partially separated from header nav behavior.

Type definitions live in `public/page.ts`, while runtime schema rules live in element methods. That creates drift.

## Recommended Architecture

Use a layered architecture:

1. **Schema Layer**
   Defines the canonical page JSON, version, validators, and serializer helpers.

2. **Registry Layer**
   Registers block, group, list, and formatter definitions. The editor should query registries instead of hardcoding selectors.

3. **Controller Layer**
   Owns editor state, active selection, command dispatch, history, and serialization. Custom elements call into this layer or dispatch typed events that it handles.

4. **Component Layer**
   Custom elements render UI and expose small capabilities. Blocks edit content. Groups compose blocks. Formatters emit commands.

5. **Feature Layer**
   Complex features such as header navs, grouped lists, sortable children, image linking, and rich text formatting become feature modules with local registration.

## Proposed File Structure

```text
src/
  editor/
    rich-text-editor.js
    editor-controller.js
    editor-selection.js
    editor-commands.js
    editor-history.js
    editor-serialization.js
    editor-events.js

  schema/
    page.schema.js
    page.types.ts
    page-defaults.js
    page-normalize.js
    page-validators.js

  registries/
    block-registry.js
    group-registry.js
    formatter-registry.js
    command-registry.js

  components/
    blocks/
      button/
        button-block.js
        button-block.styles.js
        button.schema.js
      image/
      icon/
      rich-text/

    groups/
      base/
        group-base.js
        group-base.styles.js
      header/
        header-group.js
        header-group.styles.js
        header.schema.js
      hero/
      footer/

    lists/
      block-list/
        block-list-group.js
        block-list.schema.js
        block-list-commands.js
      header-nav/
        header-nav-list.js
        header-nav.schema.js

    toolbars/
      format-toolbar/
      group-format-toolbar/
      controls/
        toggle-control.js
        color-control.js
        link-control.js
        sort-list-control.js

    dialogs/
      confirm-dialog.js
      sortable-list-dialog.js
      group-picker-dialog.js

  features/
    button-formatting/
      register.js
      commands.js
      controls.js
    image-formatting/
    group-style/
    sortable-lists/
    rich-text-formatting/

  utils/
    ids.js
    dom.js
    events.js
    colors.js
```

This is a target structure. Do not move everything at once. Move one slice at a time.

## Schema Direction

Introduce a versioned root format:

```json
{
  "version": 1,
  "groups": []
}
```

Only accept the versioned root format on load. Normalize it into sorted groups and sorted list children:

```js
const page = normalizePage(input);
```

Canonical group shape:

```json
{
  "id": "group-id",
  "type": "header",
  "sort": 0,
  "style": {
    "backgroundColor": "",
    "borderWidth": "",
    "borderColor": "",
    "borderStyle": "",
    "borderRadius": ""
  },
  "blocks": []
}
```

Prefer `sort` over relying on array position where users can reorder children. Keep array order meaningful, but serialize explicit sort keys for stable backend rendering and diffing.

For list-like blocks:

```json
{
  "id": "navs",
  "type": "navs",
  "children": [
    {
      "id": "random-hash",
      "type": "button",
      "sort": 0
    }
  ]
}
```

Move `public/page.ts` to `src/schema/page.types.ts` and export it from the app. `public/` should only contain public assets unless there is a clear build reason.

## Registry Design

Each block/group should register metadata:

```js
registerBlock({
  type: "button",
  tagName: "button-block",
  selector: "button-block",
  create: () => document.createElement("button-block"),
  capabilities: {
    text: false,
    fontSize: false,
    color: false,
    backgroundColor: false,
    link: true,
    disabled: true,
  },
  normalize(data) {},
  serialize(element) {},
  commands: {
    buttonDesign(target, value) {},
    buttonLink(target, value) {},
  },
  format(target) {},
});
```

The editor can then discover behavior:

- Which elements are selectable.
- Which commands are supported by the active target.
- Which toolbar controls should be shown.
- How to serialize and deserialize.

This avoids constantly editing central selector strings.

## Capabilities And Restrictions

Formatting should be controlled by capabilities that can be passed as parameters from a group, list, block, or schema definition. This avoids hardcoded toolbar rules such as "buttons cannot use text color" or "this rich text field cannot change font size".

Example block registration:

```js
registerBlock({
  type: "rich-text",
  tagName: "rich-text-block",
  capabilities: {
    fontFamily: true,
    fontSize: true,
    color: true,
    bold: true,
    italic: true,
    link: true,
  },
});
```

Example group-level override:

```js
registerGroup({
  type: "header",
  blocks: {
    title: {
      type: "rich-text",
      capabilities: {
        fontSize: false,
        color: true,
        link: false,
      },
    },
  },
});
```

Example list child override:

```js
registerList({
  type: "navs",
  childType: "button",
  childCapabilities: {
    buttonDesign: false,
    icon: true,
    link: true,
    disabled: true,
    color: false,
    fontSize: false,
  },
});
```

Capabilities should be merged in this order:

1. Block type defaults.
2. Feature defaults.
3. Group or list overrides.
4. Instance-level schema overrides, if needed.

The editor should expose the merged capability object in selection state:

```js
{
  block,
  group,
  list,
  capabilities: {
    fontSize: false,
    color: false,
    link: true
  }
}
```

Formatter controls should not decide availability from tag names. They should ask the active selection capabilities:

```js
formatter.disabled = !selection.capabilities.fontSize;
```

Commands should also check capabilities before applying changes. Toolbar hiding is not enough because commands may come from shortcuts, menus, or future APIs.

```js
registerCommand("fontSize", {
  capability: "fontSize",
  run(target, value) {
    target.setFontSize(value);
  },
});
```

This lets future features pass restrictions declaratively, for example:

- A title field where font size is fixed.
- Nav buttons where text color is controlled by design style.
- Footer links where icons are disabled.
- Campaign cards where image border radius cannot be changed.
- Rich text disclaimers where only link and bold are allowed.

## Generic Configured Blocks

A generic block element is a good next step for common content types. Instead of creating a new custom element for every small variation, create a generic configurable block that receives an allowed feature list.

Example:

```html
<editable-block
  block-id="title"
  block-type="rich-text"
  features="text,fontFamily,bold,link"
></editable-block>
```

Or from schema/registration:

```js
registerGroup({
  type: "header",
  blocks: {
    title: {
      element: "editable-block",
      type: "rich-text",
      features: ["text", "fontFamily", "bold", "link"],
    },
    navs: {
      element: "block-list",
      type: "navs",
      childType: "button",
      childFeatures: ["text", "icon", "link", "disabled"],
    },
  },
});
```

The formatter panel should be generated from `features`. If the active block has:

```js
features: ["text", "bold", "link"];
```

then the toolbar shows only text, bold, and link controls. It does not show font size, color, alignment, image controls, or button design.

This is the right direction for:

- Rich text variations.
- Button variations.
- Simple image variations.
- Icon variations.
- List children that share the same base behavior with different allowed controls.

Use a small set of generic primitives:

```text
editable-text-block
editable-button-block
editable-image-block
editable-icon-block
editable-list-block
```

Avoid one universal block that tries to handle every rendering case. A single `editable-block` for everything can become hard to reason about because image editing, text selection, buttons, icons, and lists have different DOM and accessibility requirements.

Recommended hybrid:

- Generic primitive components handle repeated editing behavior.
- Feature arrays decide which controls are available.
- Specialized group components still own layout.
- Specialized block components are allowed only when rendering or data shape is genuinely unique.

Feature names should be stable constants, not arbitrary strings spread across files:

```js
export const FEATURES = {
  text: "text",
  fontFamily: "fontFamily",
  fontSize: "fontSize",
  color: "color",
  backgroundColor: "backgroundColor",
  bold: "bold",
  italic: "italic",
  underline: "underline",
  link: "link",
  align: "align",
  buttonDesign: "buttonDesign",
  icon: "icon",
  imageUpload: "imageUpload",
  border: "border",
  borderRadius: "borderRadius",
  disabled: "disabled",
  sort: "sort",
};
```

The editor should normalize feature arrays into capability objects:

```js
featuresToCapabilities(["text", "bold", "link"]);
// {
//   text: true,
//   bold: true,
//   link: true,
//   fontSize: false,
//   color: false
// }
```

Use arrays for authoring ergonomics, but use objects internally for fast lookup:

```js
const canUseFontSize = selection.capabilities.fontSize === true;
```

This keeps the HTML/schema easy to read while making command and toolbar checks cheap.

The schema should store the feature configuration only when it is instance-specific. Prefer defaults in group/block registration so saved JSON does not become noisy.

## Command Model

Replace command-specific branches in `rich-text-editor.js` with command handlers:

```js
dispatchCommand({
  name: "buttonDesign",
  value: "nav",
  target: activeTarget,
});
```

Handlers should return the next format state:

```js
{
  changed: true,
  format: target.getSelectionFormat()
}
```

Commands should be registered by feature modules. For example, the image feature registers `imageLink`, `imageLinkTarget`, border radius, and disabled handling for images.

## Selection Model

Create `editor-selection.js` with one source of truth:

```js
{
  block: HTMLElement | null,
  group: HTMLElement | null,
  list: HTMLElement | null,
  range: Range | null
}
```

The editor should publish one event after selection changes:

```js
editor - selection - change;
```

Toolbars consume selection state and registered capabilities. They should not need to know specific group tags.

## Lists And Reordering

Keep `BlockListGroup`, but move it under `components/lists/block-list/`. Treat it as a reusable primitive:

- `min`
- `max`
- `childType`
- `createChild`
- `serializeChild`
- `normalizeChildren`
- `emptyPlaceholder`
- `reorderChildren`

Header navs should be a configuration of that primitive, not a separate behavior fork:

```js
registerList({
  type: "navs",
  tagName: "header-nav-list",
  childType: "button",
  defaultChild: { type: "button", design: "nav" },
});
```

The sort dialog should not be tied to `block-group`. It should be a generic `sortable-list-dialog` that receives items and emits ordered ids.

## Toolbar Model

Toolbars should be assembled from registered controls:

```js
registerFormatter({
  id: "button-design",
  targetTypes: ["button"],
  capability: "buttonDesign",
  command: "buttonDesign",
  control: "format-button-design",
});
```

Then `format-toolbar` can render groups or show/hide controls based on active target capabilities. A formatter should be visible only when the active target supports the capability, and disabled when the target is selected but the capability is read-only or unavailable.

This matters because the current toolbar markup in `index.html` will grow every time a feature is added. Eventually the toolbar should be generated from configuration, with optional slots for custom layout.

## Performance Improvements

Avoid repeated whole-editor queries on every selection and command. Cache registries and use event composed paths for active targets.

Avoid serializing every group/block during small UI updates. Serialize only when output/save is requested, and use schema serializers rather than DOM scans where possible.

For large pages, group rendering should become more incremental:

- Keep group data in controller state.
- Render only visible groups if page size grows significantly.
- Avoid re-rendering all groups when order changes; update `sort`/CSS order and controller state.

Rich text blocks should avoid expensive DOM parsing on every keystroke. Keep content editing local, and serialize inner HTML on blur/save or with debounced updates.

Dialogs such as sort lists should receive plain data snapshots. Reordering should update DOM once when applied, not after every drag hover.

## Extensibility Rules

Adding a new block should require:

1. Create component.
2. Add schema normalizer/serializer.
3. Register block metadata.
4. Define default capabilities and restrictions.
5. Register optional formatter controls.

Adding a new group should require:

1. Create group component.
2. Add group schema/defaults.
3. Register group metadata.
4. Define block capability overrides.
5. Add picker metadata.

Adding a new list-like feature should require:

1. Configure `BlockListGroup` or subclass only for presentation defaults.
2. Define child block type.
3. Define child capability overrides.
4. Register list formatter controls.
5. Update the schema version and validator if output shape changes.

## Migration Plan

### Phase 1: Stabilize Schema

- Move page types to `src/schema/page.types.ts`.
- Add `normalizePage(data)` and `serializePage(editor)`.
- Keep backward compatibility with current array root.
- Keep nav buttons only inside the `navs.children` list block.

### Phase 2: Extract Editor Controller

- Move active block/group/list state out of `rich-text-editor.js`.
- Move command routing into `editor-commands.js`.
- Keep current events temporarily to avoid a large rewrite.

### Phase 3: Add Registries

- Register existing blocks and groups.
- Replace hardcoded selector constants with registry selectors.
- Move formatter command metadata into a formatter registry.
- Move current toolbar enable/disable rules into capability definitions.

### Phase 4: Refactor Lists

- Move `block-list-group` to `components/lists/block-list/`.
- Convert header navs to a list configuration.
- Make sort dialog a generic component.

### Phase 5: Generate Toolbars

- Start with group/list controls.
- Then migrate button/image/text controls.
- Keep manual markup until generated controls are stable.

### Phase 6: Tests

Add focused tests for:

- Schema normalization and validation.
- Header nav serialization.
- List add/delete/min/max/sort behavior.
- Command routing for button/image/rich text.

## Near-Term Recommendations

Do these first:

1. Create `src/schema/` and move `public/page.ts` types there.
2. Add `page-normalize.js` for strict versioned page normalization.
3. Extract selector constants from `rich-text-editor.js` into one registry-like module.
4. Move the random id helper from list code into `src/utils/ids.js`.
5. Convert `group-format-toolbar` and `format-toolbar` to consume capability objects instead of specific tag names.
6. Add capability checks to command handlers before mutating a block.

Avoid doing these first:

- Do not rewrite all groups at once.
- Do not introduce a state library yet.
- Do not replace Lit/custom elements unless there is a separate product reason.
- Do not add SortableJS unless native drag/drop becomes insufficient on target devices.

## Target Outcome

After this refactor, a new feature such as a sortable FAQ list should not require editing `rich-text-editor.js`, multiple toolbar switch statements, and custom serialization overrides. It should be mostly registration plus one component.

That is the architectural line to aim for: the editor core should know how to select, command, serialize, and render registered capabilities. Feature modules should own feature-specific behavior.
