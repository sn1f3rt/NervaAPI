/// <reference types="vite/client" />

// Injected at build time by Vite (see vite.config.ts) from pyproject.toml.
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
