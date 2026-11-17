import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORTED_REGIONS = new Set([
  'AR', 'UY', 'CL', 'BO', 'PE', 'PY', 'VE', 'CO', 'MX', 'BR', 'EC', 'US', 'CA',
]);

const validatePersonName = (value: string, fieldName: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return `El ${fieldName} es obligatorio.`;
  if (trimmed.length < 2 || trimmed.length > 50) {
    return `El ${fieldName} debe tener entre 2 y 50 caracteres.`;
  }
  if (!NAME_REGEX.test(trimmed)) {
    return `El ${fieldName} solo puede contener letras, espacios, apóstrofes y guiones.`;
  }
  return null;
};

export const validateNombre = (value: string): string | null =>
  validatePersonName(value, 'nombre');

export const validateApellido = (value: string): string | null =>
  validatePersonName(value, 'apellido');

export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'El email es obligatorio.';
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Ingresa un email válido (ej. usuario@dominio.com).';
  }
  return null;
};

export const validateCelular = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'El celular es obligatorio.';

  const phone = parsePhoneNumberFromString(trimmed, 'AR');
  if (!phone?.isValid()) {
    return 'Ingresa un número de celular válido para países americanos.';
  }
  if (!phone.country || !SUPPORTED_REGIONS.has(phone.country)) {
    return 'Solo se aceptan números de países americanos.';
  }

  return null;
};
