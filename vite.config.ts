import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-scripts',
      apply: 'build',
      writeBundle() {
        const srcDir = path.resolve(__dirname, 'safecart/scripts');
        const destDir = path.resolve(__dirname, 'safecart/dist/scripts');
        mkdirSync(destDir, { recursive: true });
        copyFileSync(path.join(srcDir, 'scanner.js'), path.join(destDir, 'scanner.js'));
        console.log('✓ Copied scanner.js to dist');
      }
    }
  ],
  build: {
    outDir: "safecart/dist",
    emptyOutDir: true,
    rollupOptions: {
      // add the content script as a second entry so Vite transpiles the
      // JSX and spits out a plain JS file in the assets folder
      input: {
        popup: path.resolve(__dirname, "safecart/popup.html")
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].css'
      }
    }
  }
});