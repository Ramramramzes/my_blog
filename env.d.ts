/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_BASEURL: string;
  readonly VITE_WS_API: string;
  readonly VITE_JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}