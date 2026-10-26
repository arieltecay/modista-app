/**
 * Genera una URL optimizada utilizando la tecnología nativa de Cloudinary.
 * f_auto: selecciona el mejor formato (AVIF/WebP).
 * q_auto: optimiza el peso sin perder calidad.
 */
export const getOptimizedUrl = (url?: string, width?: number, height?: number, crop: 'fill' | 'limit' | 'fit' = 'fill'): string => {
  if (!url) return '';
  
  if (!url.includes('cloudinary.com')) return url;

  try {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    let transformations = 'f_auto,q_auto';
    
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    
    if (crop === 'fill') {
      transformations += `,c_fill,g_auto`;
    } else {
      transformations += `,c_${crop}`;
    }

    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  } catch (e) {
    console.error('Error al optimizar URL:', e);
    return url;
  }
};

/**
 * Genera una URL LQIP (Low Quality Image Placeholder) para efecto blur-up.
 * Imagen tiny (20px) con blur agresivo y calidad mínima.
 */
export const getBlurUpUrl = (url?: string): string => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  try {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    return `${parts[0]}/upload/e_blur:1000,q_1,w_20,f_auto/${parts[1]}`;
  } catch {
    return url;
  }
};

/**
 * Dimensiones de la imagen del hero de la landing. Fuente ÚNICA: el <img> de
 * HeroSection y el <link rel="preload"> de use-landing-data deben pedir
 * exactamente la misma URL para que el navegador reutilice la descarga.
 */
export const LANDING_HERO_IMAGE = { width: 560, height: 700 } as const;

export const getLandingHeroUrl = (url?: string): string =>
  getOptimizedUrl(url, LANDING_HERO_IMAGE.width, LANDING_HERO_IMAGE.height);

/**
 * Genera un `srcset` de Cloudinary a partir de una lista de anchos.
 * @param aspect alto/ancho (4:5 → 1.25)
 */
export const getSrcSet = (
  url: string | undefined,
  widths: number[],
  aspect: number,
  crop: 'fill' | 'limit' | 'fit' = 'fill'
): string =>
  url
    ? widths.map((w) => `${getOptimizedUrl(url, w, Math.round(w * aspect), crop)} ${w}w`).join(', ')
    : '';
