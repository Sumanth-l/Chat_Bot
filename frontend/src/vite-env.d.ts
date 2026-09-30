/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_AI_PROVIDER?: 'gemini' | 'groq';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
