const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

/** Whole Argentine pesos, e.g. `$ 20.900`. */
export const formatArs = (amount: number): string => pesos.format(amount);
