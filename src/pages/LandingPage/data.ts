import type { BenefitItem, TestimonialItem, StatItem } from './types';

export const BENEFITS: BenefitItem[] = [
  {
    emoji: '🎥',
    title: 'Clases paso a paso en video',
    desc: 'Técnicas explicadas en detalle. Pausá, retrocedé, practicá a tu ritmo.',
  },
  {
    emoji: '📐',
    title: 'Moldes a medida',
    desc: 'Clases explicadas paso a paso.',
  },
  {
    emoji: '💬',
    title: 'Acompañamiento directo',
    desc: 'Consultá tus dudas por WhatsApp. Mica te responde durante todo el curso.',
  },
  {
    emoji: '♾️',
    title: 'Acceso sin vencimiento',
    desc: 'Entrá cuando quieras, repasá las lecciones. El curso es tuyo para siempre.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Laura',
    role: 'ama de casa',
    text: 'Hice el abrigo para mi hija de 5 años y quedó hermoso. Arranqué sin saber nada de costura y Mica explica todo como si estuviera al lado tuyo.',
  },
  {
    name: 'Carolina',
    role: 'docente',
    text: 'En 3 semanas terminé mi primer tapado. No podía creer el resultado. El acompañamiento por WhatsApp hace toda la diferencia.',
  },
  {
    name: 'Mariana',
    role: 'emprendedora',
    text: 'El curso me dio las bases que necesitaba. Ahora estoy haciendo abrigos para vender y mis clientas están felices.',
  },
];

export const STATS: StatItem[] = [
  { value: 'Mica', label: 'Guevara · Instructora' },
  { value: '8', label: 'Módulos completos' },
  { value: '100%', label: 'Online' },
];
