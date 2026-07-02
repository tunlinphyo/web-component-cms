# UI Editor Mini Guide

## Run The App

This project uses Vite+. Use `vp`, not `npm`, `pnpm`, or `yarn` directly.

```sh
vp install
vp dev
vp check
vp build
```

The app starts from `src/main.js`. It imports `src/plugin/index.js`, which registers the editor, blocks, groups, lists, toolbar controls, and command metadata.

## Editor Data

The editor loads a versioned page JSON file and initializes `<rich-text-editor>`.

```js
document.querySelector("rich-text-editor")?.init(pageData);
```

The saved shape is:

```json
{
  "version": 1,
  "groups": [
    {
      "id": "group-id",
      "type": "paragraph",
      "sort": 0,
      "style": {},
      "blocks": []
    }
  ]
}
```

Call `editor.toJSON()` to serialize the current editor state. The editor also exposes `undo()` and `redo()`.

## Create A Custom Group

Project groups live in `src/customize/groups/<name>/`. Extend `GroupBase`, render registered blocks, and register the custom element.

```js
import { html } from "lit";
import { GroupBase } from "../../../plugin/components/groups/base/group-base.js";

export class QuoteGroup extends GroupBase {
  static defaultJson = {
    blocks: [
      { id: "quote", type: "p", value: "" },
      { id: "author", type: "p", value: "" },
    ],
  };

  render() {
    return html`
      <div data-group-box>
        <rich-text-block block-id="quote" placeholder="Quote"></rich-text-block>
        <rich-text-block block-id="author" placeholder="Author"></rich-text-block>
      </div>
      ${this.renderSortControls()}
    `;
  }
}

customElements.define("quote-group", QuoteGroup);
```

Register it in `src/customize/groups/index.js`:

```js
import "./quote/quote-group.js";

registerGroup({
  type: "quote",
  tagName: "quote-group",
  selector: "quote-group",
  label: "quote",
});
```

Notes:

- Every editable child block needs a stable `block-id`.
- `GroupBase.init()` maps saved block data by `block-id`.
- `GroupBase.toJSON()` serializes all registered blocks found in the group.
- Use `static defaultJson` for newly inserted groups.
- Set `addable: false` in `registerGroup()` if the group should not appear in the picker.

## Create A Custom List

Use `BlockListGroup` when you need add/delete/sort behavior for repeated child blocks.

```js
import { BlockListGroup } from "../block-list/block-list-group.js";

export class NewsListGroup extends BlockListGroup {
  get prefix() {
    return "news";
  }

  get placeholder() {
    return "News";
  }

  get itemLabel() {
    return "News item";
  }
}

customElements.define("news-list-group", NewsListGroup);
```

Register it in `src/plugin/features/list/index.js`:

```js
import "../../components/lists/news/news-list-group.js";

registerList({
  type: "news-list",
  tagName: "news-list-group",
  selector: "news-list-group",
});
```

Use it inside a group template:

```js
html`
  <news-list-group min="1" max="6" block-tag="button-block" placeholder="News">
    <button-block placeholder="News 1"></button-block>
  </news-list-group>
`;
```

List behavior provided by `BlockListGroup`:

- `addBlock(activeBlock)`
- `deleteBlock(activeBlock)`
- `reorderBlocks(ids, activeBlock)`
- `setBlockData(blocks)`
- `getFormat(activeBlock)`

The group toolbar controls `block-group-filter` and `block-group-sort` use these methods through editor events.

## Feature Registration Rules

Add imports and registrations in `src/plugin/features/`, not in the registries.

- Blocks: `registerBlock()` in the relevant feature module.
- Groups: `registerGroup()` in `src/plugin/features/group/index.js`.
- Lists: `registerList()` in `src/plugin/features/list/index.js`.
- Commands: `registerCommand()` in the feature that owns the behavior.

Registries in `src/plugin/registries/` should stay pure lookup/registration modules.

## Image Picker

`image-block` opens an image-list picker instead of the browser file picker. The host app, such as Vue, provides the image list when the picker opens. Until images are provided, the picker shows an empty state.

The image response can be an array or an object with an `images` array:

```js
const imageResponse = {
  ok: true,
  count: 2,
  images: [
    {
      originalName: "img_hero_pc01.jpeg",
      id: "0fcecf4f-6a6a-4a24-9be6-19bffee5d3da",
      filename: "0fcecf4f-6a6a-4a24-9be6-19bffee5d3da.jpeg",
      mimeType: "image/jpeg",
      size: 149369,
    },
  ],
};
```

Listen for `image-picker-open` on a parent such as `<rich-text-editor>`:

```js
editor.addEventListener("image-picker-open", (event) => {
  event.detail.setImageBaseUrl("/uploads");
  event.detail.setImages(imageResponse);
});
```

When an image is selected, `image-block` stores a URL path in `src`. It resolves images in this order:

- `image.url`
- `image.path`
- `image.src`
- `image.filename`

If the selected value is a relative filename, `image-base-url` or `setImageBaseUrl()` is prepended.

## Flexible Group Styles

Use `GroupBase` for shared editable style fields:

- `backgroundColor`
- `borderWidth`
- `borderColor`
- `borderStyle`
- `borderRadius`

For many custom groups, keep layout and visual rules inside each group component or style file. The registry can also carry defaults for new groups:

```js
registerGroup({
  type: "quote",
  tagName: "quote-group",
  selector: "quote-group",
  label: "quote",
  defaultStyle: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
  },
});
```

`GroupOrder` passes `defaultStyle` into `group.init()` when creating a new group:

```js
const defaultData = {
  ...(group.constructor.defaultJson ?? {}),
  style: {
    ...(definition.defaultStyle ?? {}),
    ...(group.constructor.defaultJson?.style ?? {}),
  },
};

group.init(defaultData);
```

Keep group-specific CSS in the group style file:

```css
:host([group-type="quote"]) [data-group-box] {
  padding: 32px;
}
```

This keeps shared editor controls simple while still allowing each group to have a custom design.

## Multiple Group Pickers

The picker uses all registered groups with `addable !== false` when no picker context is set. To support different picker lists, add picker metadata to group registration:

```js
registerGroup({
  type: "hero",
  tagName: "hero-group",
  selector: "hero-group",
  label: "hero",
  picker: "landing",
});

registerGroup({
  type: "paragraph",
  tagName: "paragraph-group",
  selector: "paragraph-group",
  label: "paragraph",
  picker: "content",
});
```

Then let each `<group-order>` choose a picker context:

```html
<group-order picker="landing"></group-order> <group-order picker="content"></group-order>
```

`group-picker-dialog` filters by that context:

```js
const groups = listGroupDefinitions().filter(
  (definition) =>
    definition.addable !== false && (!this.picker || definition.picker === this.picker),
);
```

If a group should appear in multiple pickers, use an array:

```js
registerGroup({
  type: "image",
  tagName: "image-group",
  selector: "image-group",
  label: "image",
  picker: ["landing", "content"],
});
```

Use this filter:

```js
function matchesPicker(definition, picker) {
  if (!picker) return true;

  const pickers = Array.isArray(definition.picker) ? definition.picker : [definition.picker];
  return pickers.includes(picker);
}
```

Recommended ownership:

- `registerGroup()` owns metadata like `picker`, `defaultStyle`, `label`, and `addable`.
- `group-order` owns which picker context is active.
- `group-picker-dialog` filters and displays groups.
- Group components own their layout and custom CSS.

## Validation

After adding a group or list, run:

```sh
vp check
vp build
```
