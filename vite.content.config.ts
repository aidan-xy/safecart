import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "safecart/dist/assets",
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(
        __dirname,
        "safecart/frontend/content/contentScript.jsx"
      ),
      output: {
        inlineDynamicImports: true,
        entryFileNames: "contentScript.js"
      },
      external: ['safecart/tests/**']
    }
  }
});