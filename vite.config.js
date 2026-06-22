import { defineConfig } from "vite-plus";

export default defineConfig({
  server: {
    host: true,
    port: 1234,
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
