/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_GA_MEASUREMENT_ID?: string;
    readonly VITE_CLARITY_PROJECT_ID?: string;
    readonly VITE_GTM_ID?: string;
    readonly VITE_FACEBOOK_PIXEL_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    dataLayer: any[];
    fbq: (type: string, name: string, parameters?: any) => void;
    _fbq: any;
    clarity: (...args: any[]) => void;
}
