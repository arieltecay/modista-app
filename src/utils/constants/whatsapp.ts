export const WHATSAPP_NUMBER = '5493815734249';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const buildWhatsAppUrl = (message: string): string =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_MESSAGES = {
  paymentSuccess: '¡Hola! Acabo de pagar un curso en Modista y quiero confirmar mi acceso.',
  paymentFailure: 'Hola, tuve un problema con el pago de un curso en Modista.',
  paymentPending: 'Hola, mi pago en Modista figura como pendiente y quiero consultar el estado.',
  coursePurchase: (title: string, price: number) =>
    `Hola Mila! Me gustaría comprar el curso: ${title}. El precio es $${price}. ¿Cómo puedo hacer el pago?`,
  general: 'Hola Mila! Tengo una consulta general sobre la academia',
} as const;
