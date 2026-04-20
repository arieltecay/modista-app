/**
 * Formatea texto plano para mostrarlo como HTML enriquecido de forma segura.
 * Versión de Alta Seguridad: Evita colisiones de Markdown mediante tokens alfanuméricos puros.
 * 
 * @param {string} text - El texto crudo a formatear
 * @returns {string} El HTML resultante listo para dangerouslySetInnerHTML
 */
export const formatTextToHtml = (text) => {
  if (!text) return '';

  const tokens = [];
  let processedText = text;

  // 1. FASE DE CAPTURA: Identificar Enlaces, Botones e IMÁGENES
  // Generamos tokens alfanuméricos puros para evitar colisiones con Markdown (* o _)
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    const cleanLabel = label.trim();
    const cleanUrl = url.trim();
    let htmlContent = '';

    if (cleanLabel.startsWith('img:')) {
      const altText = cleanLabel.replace(/^img:/, '').trim();
      htmlContent = `<div class="my-6 flex flex-col items-center group"><div class="relative overflow-hidden rounded-xl border-2 border-pink-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-pink-200"><img src="${cleanUrl}" alt="${altText}" loading="lazy" class="max-w-[220px] h-auto cursor-zoom-in transition-transform duration-500 group-hover:scale-110" onclick="window.open('${cleanUrl}', '_blank')" /></div><p class="text-[10px] text-gray-400 mt-2 italic font-medium uppercase tracking-widest text-center">${altText}</p></div>`;
    } else if (cleanLabel.startsWith('btn:')) {
      const buttonText = cleanLabel.replace(/^btn:/, '').trim();
      htmlContent = `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="inline-block bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-all duration-200 my-2 font-semibold shadow-md hover:scale-105 active:scale-95 no-underline decoration-transparent">${buttonText}</a>`;
    } else {
      htmlContent = `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-pink-600 hover:text-pink-700 underline font-medium decoration-pink-300 transition-colors">${cleanLabel}</a>`;
    }

    // Token sin guiones bajos para que el formateador de cursivas lo ignore
    const tokenId = `MODISTATOKEN${tokens.length}X`;
    tokens.push({ id: tokenId, content: htmlContent });
    return tokenId;
  });

  // 2. FASE DE SANITIZACIÓN: Escapar caracteres peligrosos
  processedText = processedText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 3. FASE DE FORMATO: Negritas, Cursivas y Listas
  // Ahora el motor de cursivas (_texto_) no encontrará coincidencias en nuestros tokens
  processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  processedText = processedText.replace(/_([^_]+)_/g, '<em class="italic text-gray-800">$1</em>');
  
  // Procesar listas
  processedText = processedText.replace(/^(\s*)([*])\s+/gm, '$1• ');
  processedText = processedText.replace(/^(\s*)(-)\s+/gm, '$1• ');
  processedText = processedText.replace(/^(\s*)(\d+)\.\s+/gm, '$1$2. ');

  // 4. FASE DE SALTOS DE LÍNEA
  processedText = processedText.replace(/\n/g, '<br>');

  // 5. FASE DE RESTAURACIÓN: Inyectar el HTML seguro
  tokens.forEach(token => {
    // Usamos split/join para un reemplazo literal masivo y seguro
    processedText = processedText.split(token.id).join(token.content);
  });

  return processedText;
};
