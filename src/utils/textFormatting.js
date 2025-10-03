/**
 * Formatea texto plano para mostrarlo como HTML básico,
 * preservando saltos de línea y formato simple.
 * @param {string} text - Texto plano a formatear
 * @returns {string} HTML formateado
 */
export const formatTextToHtml = (text) => {
  if (!text) return '';

  // Reemplazar saltos de línea con <br>
  let html = text.replace(/\n/g, '<br>');

  // Manejar viñetas simples (* o - al inicio de línea)
  html = html.replace(/^(\s*)([*])\s+/gm, '$1• ');
  html = html.replace(/^(\s*)(-)\s+/gm, '$1• ');

  // Manejar numeración simple (1. 2. etc al inicio de línea)
  html = html.replace(/^(\s*)(\d+)\.\s+/gm, '$1$2. ');

  return html;
};