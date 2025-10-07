import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

// Regiones soportadas para números de teléfono (países americanos)
const SUPPORTED_REGIONS = [
  'AR', // Argentina
  'UY', // Uruguay
  'CL', // Chile
  'BO', // Bolivia
  'PE', // Perú
  'PY', // Paraguay
  'VE', // Venezuela
  'CO', // Colombia
  'MX', // México
  'BR', // Brasil
  'EC', // Ecuador
  'US', // Estados Unidos
  'CA', // Canadá
];

/**
 * Valida el campo nombre.
 * @param {string} value - Valor del campo nombre
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateNombre = (value) => {
  if (!value || !value.trim()) {
    return 'El nombre es obligatorio.';
  }

  const trimmed = value.trim();

  if (trimmed.length < 2 || trimmed.length > 50) {
    return 'El nombre debe tener entre 2 y 50 caracteres.';
  }

  // Solo letras, espacios, apóstrofes y guiones (soporta acentos)
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
    return 'El nombre solo puede contener letras, espacios, apóstrofes y guiones.';
  }

  return null;
};

/**
 * Valida el campo apellido.
 * @param {string} value - Valor del campo apellido
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateApellido = (value) => {
  if (!value || !value.trim()) {
    return 'El apellido es obligatorio.';
  }

  const trimmed = value.trim();

  if (trimmed.length < 2 || trimmed.length > 50) {
    return 'El apellido debe tener entre 2 y 50 caracteres.';
  }

  // Solo letras, espacios, apóstrofes y guiones (soporta acentos)
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
    return 'El apellido solo puede contener letras, espacios, apóstrofes y guiones.';
  }

  return null;
};

/**
 * Valida el campo email.
 * @param {string} value - Valor del campo email
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateEmail = (value) => {
  if (!value || !value.trim()) {
    return 'El email es obligatorio.';
  }

  const trimmed = value.trim();

  // Regex mejorada para emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return 'Ingresa un email válido (ej. usuario@dominio.com).';
  }

  return null;
};

/**
 * Valida el campo celular usando google-libphonenumber.
 * Soporta números de países americanos con formatos variables.
 * @param {string} value - Valor del campo celular
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateCelular = (value) => {
  if (!value || !value.trim()) {
    return 'El celular es obligatorio.';
  }

  const trimmed = value.trim();

  try {
    // Intentar parsear el número (la librería detecta automáticamente el código de país)
    const number = phoneUtil.parseAndKeepRawInput(trimmed, 'AR'); // Default a AR si no hay +

    // Verificar si es un número válido
    if (!phoneUtil.isValidNumber(number)) {
      return 'Ingresa un número de celular válido para países americanos.';
    }

    // Verificar si pertenece a una región soportada
    const region = phoneUtil.getRegionCodeForNumber(number);
    if (!SUPPORTED_REGIONS.includes(region)) {
      return 'Solo se aceptan números de países americanos.';
    }

    return null;
  } catch {
    return 'Ingresa un número de celular válido (ej. +543811234567 o 543811234567).';
  }
};

/**
 * Valida todo el formulario de inscripción.
 * @param {Object} formData - Objeto con los datos del formulario
 * @returns {Object} Objeto con errores por campo (vacío si no hay errores)
 */
export const validateInscriptionForm = (formData) => {
  const errors = {};

  const nombreError = validateNombre(formData.nombre);
  if (nombreError) errors.nombre = nombreError;

  const apellidoError = validateApellido(formData.apellido);
  if (apellidoError) errors.apellido = apellidoError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const celularError = validateCelular(formData.celular);
  if (celularError) errors.celular = celularError;

  return errors;
};