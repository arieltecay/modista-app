/** Validadores compartidos por los formularios v2. */

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUPPORTED_PHONE_REGIONS = new Set([
  'AR', 'UY', 'CL', 'BO', 'PE', 'PY', 'VE', 'CO', 'MX', 'BR', 'EC', 'US', 'CA',
]);

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

export const validatePhone = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Necesitamos tu WhatsApp para darte acceso.';

  if (!/^\+?[0-9\s\-()]+$/.test(trimmed)) {
    return 'Usá solo números, espacios y guiones.';
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15 || /^(\d)\1+$/.test(digits)) {
    return 'Ingresá un número válido (ej. +54 9 11 2345-6789).';
  }

  return null;
};

/**
 * Validación estricta diferida: descarga la metadata telefónica solo cuando la
 * usuaria envía el formulario, para no competir con el render inicial de la landing.
 */
export const validatePhoneStrict = async (value: string): Promise<string | null> => {
  const { parsePhoneNumberFromString } = await import('libphonenumber-js/min');
  const phone = parsePhoneNumberFromString(value.trim(), 'AR');

  if (!phone?.isValid() || !phone.country || !SUPPORTED_PHONE_REGIONS.has(phone.country)) {
    return 'Ingresá un número válido (ej. +54 9 11 2345-6789).';
  }

  return null;
};
