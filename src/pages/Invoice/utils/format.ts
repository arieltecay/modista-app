const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const dayFormat = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** Como el comprobante de ARCA: coma decimal y sin separador de miles. */
export const formatAmount = (value: number): string => value.toFixed(2).replace('.', ',');

/** Día calendario argentino (DD/MM/AAAA) de un instante. */
export const formatDate = (iso: string): string => dayFormat.format(new Date(iso));

/** AAAA-MM-DD (fecha sin hora) a DD/MM/AAAA, sin pasar por zonas horarias. */
export const formatPlainDate = (value: string): string => value.split('-').reverse().join('/');

/** Punto de venta (5 dígitos) y número (8) como los imprime ARCA. */
export const padNumber = (value: number | undefined, length: number): string => String(value ?? 0).padStart(length, '0');
