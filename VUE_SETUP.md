# Using `<rich-text-editor>` In Vue

`<rich-text-editor>` is a Web Component/custom element, so you can use it inside a Vue project without rewriting the editor in Vue.

The basic flow is:

1. Register the editor Web Components once.
2. Tell Vue to treat those tags as custom elements.
3. Wrap `<rich-text-editor>` in a Vue component.
4. Control it through a Vue `ref`.

## 1. Register Web Components

Create a file like `src/editor-elements.js` in your Vue project:

```js
import "./style.css";

import "./elements/format/format-controls";
import "./elements/block/blocks";
import "./elements/group/index.js";
import "./elements/utils/confirm-dialog";
import "./elements/rich-text-editor";
import "./elements/editor-output-button";
```

This registers tags such as:

```html
<rich-text-editor></rich-text-editor>
<format-toolbar></format-toolbar>
<group-format-toolbar></group-format-toolbar>
<group-order></group-order>
```

## 2. Configure Vue Custom Elements

In `vite.config.js`, tell Vue not to treat the editor tags as Vue components:

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const editorElements = new Set([
  "rich-text-editor",
  "group-order",
  "format-toolbar",
  "group-format-toolbar",
  "editor-output-button",
]);

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            editorElements.has(tag) ||
            tag.endsWith("-block") ||
            tag.endsWith("-group"),
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
import "../editor-elements";

import pageData from "../assets/data/page-one.json";

const editorRef = ref(null);

onMounted(() => {
  editorRef.value?.init(pageData);
});

function logOutput() {
  console.log(editorRef.value?.toJSON());
}
</script>

<template>
  <rich-text-editor ref="editorRef">
    <section>
      <group-order></group-order>

      <footer>
        <button type="button" @click="logOutput">
          Log Output
        </button>
      </footer>
    </section>

    <nav>
      <group-format-toolbar>
        <h2>Group</h2>
        <div class="format-group">
          <group-background-color></group-background-color>
          <group-border-color></group-border-color>
        </div>
      </group-format-toolbar>

      <hr />

      <format-toolbar>
        <!-- Move your existing index.html toolbar markup here. -->
      </format-toolbar>
    </nav>
  </rich-text-editor>
</template>
```

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

## Controlling The Editor From Vue

Vue controls the Web Component through a normal DOM ref:

```js
editorRef.value.init(pageData);
editorRef.value.toJSON();
```

The editor keeps its internal Lit/Web Component behavior, while Vue owns the page layout and can call public editor methods.
