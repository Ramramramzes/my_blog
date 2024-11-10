/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_BASEURL: string;
  readonly VITE_WS_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}