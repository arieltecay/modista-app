/**
 * Validadores livianos para formularios v2.
 *
 * Reemplazan a google-libphonenumber (~500KB de JS) por reglas simples y
 * predecibles para WhatsApp latinoamericano: 8-15 dígitos con formato libre
 * (se aceptan +, espacios, guiones y paréntesis). La verdad del dato la confirma
 * el envío real de WhatsApp/email post-compra; el form solo filtra errores obvios.
 */

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateFullName = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Contanos tu nombre y apellido.';
  if (trimmed.length < 3) return 'Ingresá tu nombre y apellido.';
  if (trimmed.length > 80) return 'El nombre es demasiado largo.';
  if (!NAME_REGEX.test(trimmed)) return 'Usá solo letras, espacios y guiones.';
  if (!trimmed.includes(' ')) return 'Ingresá también tu apellido.';
  return null;
};

export const validateEmailAddress = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Necesitamos tu email para enviarte el acceso.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Revisá el email (ej. nombre@correo.com).';
  return null;
};

/**
 * Celular/WhatsApp flexible: acepta formatos AR y del resto de LatAm.
 * Normalizamos a dígitos (más `+` inicial) y exigimos entre 8 y 15 dígitos.
 * Ejemplos válidos: "+54 9 11 2345-6789", "1123456789", "+54 911 2345 6789".
 */
export const validatePhone = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Necesitamos tu WhatsApp para darte acceso.';

  if (!/^\+?[0-9\s\-()]+$/.test(trimmed)) {
    return 'Usá solo números, espacios y guiones.';
  }
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (digits.length < 8 || digits.length > 15) {
    return 'Ingresá un número válido (ej. +54 9 11 2345-6789).';
  }
  return null;
};
