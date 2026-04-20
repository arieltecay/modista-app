/**
 * Utilidades relacionadas con la lógica de negocio de los cursos.
 */

/**
 * Determina si un curso es gratuito basado en su precio.
 * Maneja conversiones de string a número de forma segura.
 */
export const isCourseFree = (price: string | number | undefined | null): boolean => {
  if (price === undefined || price === null) return true;
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numericPrice === 0;
};

/**
 * Determina si se debe mostrar el formulario de inscripción para un curso.
 */
export const shouldShowInscription = (price: string | number | undefined | null): boolean => {
  return !isCourseFree(price);
};
