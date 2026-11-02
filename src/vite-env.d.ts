/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_FORMS_MODE?: 'demo' | 'netlify';
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
