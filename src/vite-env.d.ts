/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the standalone Maha Copilot app (the `maha-copilot/` FastAPI server). */
  readonly VITE_MAHA_COPILOT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  /** Runtime-configurable base URL for the embedded Maha Copilot app (set in public/maha-config.js). */
  __MAHA_COPILOT_URL__?: string
}
