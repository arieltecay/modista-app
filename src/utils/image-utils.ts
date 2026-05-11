/**
 * Genera una URL optimizada utilizando Cloudflare Image Resizing sobre imágenes de Cloudinary.
 * Esto combina lo mejor de ambos mundos: Almacenamiento gratis (Cloudinary) + Entrega ultra rápida y moderna (Cloudflare).
 * 
 * @param url URL original (Cloudinary o externa)
 * @param width Ancho deseado
 * @param height Alto deseado (opcional)
 * @param quality Calidad (default 80)
 */
export const getOptimizedUrl = (url?: string, width?: number, height?: number, quality: number = 80): string => {
  if (!url) return '';
  
  // Si no es Cloudinary, devolvemos la URL original
  if (!url.includes('cloudinary.com')) return url;

  // --- SOLUCIÓN PARA DESARROLLO LOCAL ---
  // El proxy /cdn-cgi/image/ solo existe en la infraestructura de Cloudflare.
  // En local (localhost), usamos la optimización nativa de Cloudinary para que las imágenes se vean.
  if (import.meta.env.DEV) {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    let transformations = `f_auto,q_auto`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height},c_fill`;
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  // --- SOLUCIÓN PARA PRODUCCIÓN (Cloudflare) ---
  // Construimos la URL de Cloudflare Resizing usando la URL original completa
  // para evitar romper rutas de carpetas (como /modista_app/).
  let cfTransformations = `quality=${quality},format=auto`;
  if (width) cfTransformations += `,width=${width}`;
  if (height) cfTransformations += `,height=${height},fit=cover`;

  // Usamos la ruta del proxy seguida de la URL absoluta original de Cloudinary
  return `/cdn-cgi/image/${cfTransformations}/${url}`;
};
