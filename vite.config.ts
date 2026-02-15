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
        mkdirSync('safecart/dist/scripts', { recursive: true });
        copyFileSync('safecart/scripts/scanner.js', 'safecart/dist/scripts/scanner.js');
      }
    }
  ],
  build: {
    outDir: "safecart/dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "safecart/popup.html")
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});