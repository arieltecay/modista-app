import * as yup from 'yup';

/**
 * Lista de imágenes disponibles para validación
 */
export const AVAILABLE_IMAGES = [
  '/images/caricatura.jpeg',
  '/images/chica.jpeg',
  '/images/costuraMujer.jpeg',
  '/images/hilos.jpeg',
  '/images/maniqui.jpeg',
  '/images/moda.jpg',
  '/images/molde.jpeg',
  '/images/pantalon.jpeg',
  '/images/perfil.jpg',
  '/images/persona.jpeg',
  '/images/ventana.jpeg',
  '/images/WhatsApp Image 2025-10-26 at 12.40.50.jpeg',
  '/images/WhatsApp Image 2025-10-26 at 12.41.35.jpeg',
  '/images/WhatsApp Image 2025-10-26 at 12.41.36.jpeg',
  '/images/WhatsApp Image 2025-10-26 at 12.41.361.jpeg',
  '/images/WhatsApp Image 2025-10-26 at 13.00.02.jpeg',
  '/images/PantalonSastrero.jpeg',
];

/**
 * Función para sanitizar texto eliminando caracteres peligrosos
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .trim()
    .replace(/[<>]/g, ''); // Remover tags HTML
};

/**
 * Esquema de validación para cursos usando Yup
 */
export const courseSchema = yup.object({
  title: yup
    .string()
    .required('El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .transform(sanitizeText),

  shortDescription: yup
    .string()
    .required('La descripción corta es obligatoria')
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(250, 'La descripción corta no puede exceder 250 caracteres')
    .transform(sanitizeText),

  longDescription: yup
    .string()
    .required('La descripción larga es obligatoria')
    .min(50, 'La descripción larga debe tener al menos 50 caracteres')
    .transform(sanitizeText),

  imageUrl: yup
    .string()
    .required('Debe seleccionar una imagen')
    .oneOf(AVAILABLE_IMAGES, 'Debe seleccionar una imagen de la lista'),

  category: yup
    .string()
    .required('La categoría es obligatoria')
    .min(2, 'La categoría debe tener al menos 2 caracteres')
    .max(50, 'La categoría no puede exceder 50 caracteres')
    .transform(sanitizeText),

  price: yup
    .number()
    .required('El precio es obligatorio')
    .min(0, 'El precio no puede ser negativo')
    .max(999999, 'El precio no puede exceder $999,999')
    .typeError('El precio debe ser un número válido'),

  deeplink: yup
    .string()
    .optional()
    .url('El enlace debe ser una URL válida')
    .transform((value) => value === '' ? undefined : value),

  videoUrl: yup
    .string()
    .optional()
    .url('La URL del video debe ser una URL válida')
    .transform((value) => value === '' ? undefined : value),

  coursePaid: yup
    .string()
    .optional()
    .url('El link del curso pagado debe ser una URL válida')
    .transform((value) => value === '' ? undefined : value),
});

/**
 * Valores por defecto para el formulario de curso
 */
export const defaultCourseValues = {
  title: '',
  shortDescription: '',
  longDescription: '',
  imageUrl: '',
  category: '',
  price: '',
  deeplink: '',
  videoUrl: '',
  coursePaid: '',
};

/**
 * Función helper para formatear errores de validación
 * @param {Object} errors - Errores de Yup
 * @returns {Object} Errores formateados
 */
export const formatValidationErrors = (errors) => {
  const formattedErrors = {};

  Object.keys(errors).forEach(key => {
    formattedErrors[key] = errors[key].message;
  });

  return formattedErrors;
};