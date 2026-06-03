import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// The frontend source lives in src/frontend, but the JS tooling (package.json,
// configs) sits at the repo root alongside pyproject.toml. Absolute paths keep
// `root`, `envDir` and `outDir` unambiguous regardless of where vite is invoked.
export default defineConfig({
  root: fileURLToPath(new URL('./src/frontend', import.meta.url)),
  envDir: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
  },
})
