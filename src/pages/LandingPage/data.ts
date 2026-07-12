import type { BenefitItem, TestimonialItem, StatItem } from './types';

export const BENEFITS: BenefitItem[] = [
  { emoji: '🎥', title: 'Clases grabadas', desc: 'Aprendé a tu ritmo, sin horarios fijos' },
  { emoji: '📐', title: 'Patrones incluidos', desc: 'Material descargable sin costo extra' },
  { emoji: '💬', title: 'Acompañamiento directo', desc: 'Consultá por WhatsApp durante todo el curso' },
  { emoji: '👥', title: 'Comunidad de alumnas', desc: 'Compartí avances, resolvé dudas, conectate' },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Valentina',
    role: 'estudiante de diseño',
    text: 'Nunca pensé que aprender a coser pudiera ser tan claro. Terminé mi primer abrigo en días.',
  },
  {
    name: 'Cecilia',
    role: 'emprendedora',
    text: 'El nivel de detalle en cada clase es increíble. La profe explica todo paso a paso.',
  },
];

export const STATS: StatItem[] = [
  { value: '200+', label: 'Alumnas' },
  { value: '4.9', label: '★★★★★' },
  { value: '100%', label: 'Online' },
];
