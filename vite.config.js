import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@/ui-editor": new URL("./src/plugin/index.js", import.meta.url).pathname,
    },
  },
  server: {
    host: true,
    port: 1234,
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
