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
  
  // Si no es Cloudinary, devolvemos la URL original (o podríamos también pasarla por CF)
  if (!url.includes('cloudinary.com')) return url;

  // Limpiamos la URL de Cloudinary de cualquier transformación previa para tener la original limpia
  // Cloudinary URLs: .../upload/v12345/path/to/image.jpg o .../upload/w_500,c_fill/v12345/...
  const cleanUrl = url.replace(/\/upload\/v\d+\//, '/upload/').replace(/\/upload\/.*?\//, '/upload/');

  // Construimos la URL de Cloudflare Resizing
  // Formato: /cdn-cgi/image/width=X,height=Y,quality=Z,format=auto/URL_ORIGINAL
  let cfTransformations = `quality=${quality},format=auto`;
  if (width) cfTransformations += `,width=${width}`;
  if (height) cfTransformations += `,height=${height},fit=cover`;

  // Usamos una ruta relativa para que Cloudflare Pages lo detecte automáticamente
  return `/cdn-cgi/image/${cfTransformations}/${cleanUrl}`;
};
