/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Agrega más variables de entorno según sea necesario
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
