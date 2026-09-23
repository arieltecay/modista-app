/**
 * Lectura de cookies del browser (compartido por los formularios).
 * Fuente única: evita la triple duplicación que había entre
 * InscriptionForm, LandingInscriptionForm y LandingForm v2.
 */
export const getCookieValue = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};
