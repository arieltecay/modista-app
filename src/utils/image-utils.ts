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
