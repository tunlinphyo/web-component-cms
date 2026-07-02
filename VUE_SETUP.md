# Using `<rich-text-editor>` In Vue

carefully read the CODE_MIGRATE.md and do the step 1. and notify me if you done.

`<rich-text-editor>` is a Web Component/custom element. A Vue app can use it without rewriting the editor in Vue.

The current editor structure is:

```text
src/
  components/
    blocks/
    groups/
    lists/
    toolbars/
    dialogs/
  editor/
    rich-text-editor.js
    editor-controller.js
    editor-commands.js
    editor-history.js
    editor-serializer.js
  features/
    index.js
    rich-text/
    button/
    image/
    icon/
    group/
    list/
  registries/
  schema/
  style.css
```

The important startup rule is: import `src/features/index.js` before `src/editor/rich-text-editor.js`. Features register blocks, groups, lists, toolbar controls, and command metadata before the editor computes selectors.

## 1. Register Editor Elements

Create a file like `src/editor-elements.js` in your Vue project:

```js
import "./style.css";

import "./features/index.js";
import "./editor/rich-text-editor.js";
```

This registers tags such as:

```html
<rich-text-editor></rich-text-editor>
<group-order></group-order>
<format-toolbar></format-toolbar>
<group-format-toolbar></group-format-toolbar>
<rich-text-block></rich-text-block>
<image-block></image-block>
<button-block></button-block>
```

Do not import old `src/elements/...` paths. They were replaced by `components/`, `editor/`, `features/`, and `registries/`.

## 2. Configure Vue Custom Elements

In `vite.config.js`, tell Vue not to resolve editor tags as Vue components:

```js
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const editorElements = new Set([
  "rich-text-editor",
  "group-order",
  "format-toolbar",
  "group-format-toolbar",
  "editor-output-button",
  "group-picker-dialog",
  "confirm-dialog",
]);

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            editorElements.has(tag) ||
            tag.endsWith("-block") ||
            tag.endsWith("-group") ||
            tag.endsWith("-toolbar") ||
            tag.endsWith("-control"),
        },
      },
    }),
  ],
});
```

## 3. Create A Vue Wrapper

Create `src/components/RichTextEditorWrapper.vue`:

```vue
<script setup>
import { onMounted, ref } from "vue";
import "../editor-elements.js";

import pageDataUrl from "../assets/data/page-one.json?url";

const editorRef = ref(null);
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
    {
      originalName: "img_hero_pc01.jpeg",
      id: "9626e386-74db-4d86-84a1-a66de682e55a",
      filename: "9626e386-74db-4d86-84a1-a66de682e55a.jpeg",
      mimeType: "image/jpeg",
      size: 149369,
    },
  ],
};

onMounted(async () => {
  const response = await fetch(pageDataUrl);
  const pageData = await response.json();

  editorRef.value?.init(pageData);
});

function logOutput() {
  console.log(editorRef.value?.toJSON());
}

function undo() {
  editorRef.value?.undo();
}

function redo() {
  editorRef.value?.redo();
}

function handleImagePickerOpen(event) {
  event.detail.setImageBaseUrl("/uploads");
  event.detail.setImages(imageResponse);
}
</script>

<template>
  <rich-text-editor ref="editorRef" @image-picker-open="handleImagePickerOpen">
    <section>
      <group-order picker="content"></group-order>

      <footer>
        <button type="button" @click="logOutput">Log Output</button>
        <button type="button" @click="undo">Undo</button>
        <button type="button" @click="redo">Redo</button>
      </footer>
    </section>

    <nav>
      <group-format-toolbar>
        <h2>Group</h2>
        <div class="format-group">
          <group-background-color></group-background-color>
          <group-border-color></group-border-color>
        </div>
        <div class="format-group">
          <group-border-width></group-border-width>
          <group-border-style></group-border-style>
        </div>
        <div class="format-group">
          <group-border-radius></group-border-radius>
        </div>
        <hr />
        <div class="format-group">
          <block-group-filter></block-group-filter>
          <block-group-sort></block-group-sort>
        </div>
      </group-format-toolbar>

      <hr />

      <format-toolbar>
        <!-- Move the existing toolbar markup from index.html here. -->
      </format-toolbar>
    </nav>
  </rich-text-editor>
</template>
```

The JSON example uses `?url` so the large page JSON is emitted as a separate asset instead of being bundled into the main JavaScript chunk.

## 4. Use The Wrapper

In `src/App.vue`:

```vue
<script setup>
import RichTextEditorWrapper from "./components/RichTextEditorWrapper.vue";
</script>

<template>
  <RichTextEditorWrapper />
</template>
```

## Editor Public API

Vue controls the Web Component through a normal DOM ref:

```js
editorRef.value.init(pageData);
editorRef.value.toJSON();
editorRef.value.undo();
editorRef.value.redo();
```

The editor keeps its internal Lit/Web Component behavior. Vue owns layout, routing, API calls, and when saved data is loaded or submitted.

## Image Picker Data From Vue

`image-block` no longer opens the native file picker. It emits `image-picker-open`, and Vue can provide the current image list:

```vue
<rich-text-editor ref="editorRef" @image-picker-open="handleImagePickerOpen">
  ...
</rich-text-editor>
```

```js
async function handleImagePickerOpen(event) {
  const response = await fetch("/api/images");
  const imageResponse = await response.json();

  event.detail.setImageBaseUrl("/uploads");
  event.detail.setImages(imageResponse);
}
```

The selected image is saved as an image URL path in the block `src`. `image-block` accepts `url`, `path`, `src`, or `filename` on each image item. If only `filename` exists, it prepends the configured image base URL.

## Custom Groups In Vue

Add custom groups in the same structure as this repo:

```text
src/customize/groups/quote/quote-group.js
src/customize/groups/quote/quote-group.styles.js
```

Then register the group in `src/customize/groups/index.js`:

```js
import "./quote/quote-group.js";

registerGroup({
  type: "quote",
  tagName: "quote-group",
  selector: "quote-group",
  label: "quote",
  picker: "content",
  defaultStyle: {
    borderRadius: "16px",
  },
});
```

Notes:

- `picker` controls which `<group-order picker="...">` can add this group.
- `defaultStyle` is applied when the group is newly created.
- `addable: false` hides a group from pickers.
- Group components should extend `GroupBase`.
- Editable child blocks need stable `block-id` values.

## Multiple Group Pickers

You can place multiple group orders with different picker contexts:

```html
<group-order picker="landing"></group-order> <group-order picker="content"></group-order>
```

Register groups against one or more picker contexts:

```js
registerGroup({
  type: "image",
  tagName: "image-group",
  selector: "image-group",
  label: "image",
  picker: ["landing", "content"],
});
```

If no `picker` is set on `<group-order>`, the picker shows all groups where `addable !== false`.

## Custom Lists

Lists live under `src/components/lists/` and register in `src/features/list/index.js`.

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

Register it:

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

## Validation

After moving this into Vue or adding custom groups/lists, run:

```sh
vp check
vp build
```

If this editor is copied into a Vue project that does not use Vite+, run that project’s equivalent format, lint, typecheck, and build commands.
