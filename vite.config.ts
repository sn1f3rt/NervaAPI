import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Single source of truth for the version: pyproject.toml [project].version.
// Injected into the frontend as __APP_VERSION__ (see src/frontend/vite-env.d.ts).
const pyproject = readFileSync(
  fileURLToPath(new URL('./pyproject.toml', import.meta.url)),
  'utf-8',
)
const version = pyproject.match(/^version\s*=\s*"([^"]+)"/m)?.[1] ?? '0.0.0'

// The frontend source lives in src/frontend, but the JS tooling (package.json,
// configs) sits at the repo root alongside pyproject.toml. Absolute paths keep
// `root`, `envDir` and `outDir` unambiguous regardless of where vite is invoked.
export default defineConfig({
  root: fileURLToPath(new URL('./src/frontend', import.meta.url)),
  envDir: fileURLToPath(new URL('.', import.meta.url)),
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
  },
})
