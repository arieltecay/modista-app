import React, { useState, useEffect } from 'react';
import { faqService, FAQ } from '../../services/faq/faqService';
import { trackFaqInteraction } from '../../services/analytics';
import { 
  ChevronDownIcon, 
  QuestionMarkCircleIcon, 
  ShoppingBagIcon, 
  EnvelopeIcon, 
  CreditCardIcon, 
  CheckCircleIcon, 
  BookOpenIcon 
} from '@heroicons/react/24/outline';

const ICON_MAP: Record<string, any> = {
  'question-mark-circle': QuestionMarkCircleIcon,
  'shopping-bag': ShoppingBagIcon,
  'envelope': EnvelopeIcon,
  'credit-card': CreditCardIcon,
  'check-circle': CheckCircleIcon,
  'book-open': BookOpenIcon,
};

interface FaqSectionProps {
  variant?: 'default' | 'light';
}

const theme = {
  default: {
    section: 'py-20 bg-background min-h-[300px]',
    header: 'mb-16',
    title: 'text-3xl md:text-4xl font-bold text-foreground mb-4',
    subtitle: 'text-muted-foreground text-lg',
    card: 'bg-card border-border',
    cardOpen: 'border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/10',
    cardHover: 'hover:border-primary/30',
    icon: 'bg-muted text-muted-foreground',
    iconOpen: 'bg-primary text-primary-foreground',
    question: 'text-foreground',
    questionOpen: 'text-primary',
    questionSize: 'text-lg',
    chevron: 'text-muted-foreground',
    answer: 'text-muted-foreground',
    answerSize: 'text-base',
    cta: 'mt-12 text-muted-foreground',
    skeleton: 'bg-muted',
    skeletonSection: 'py-20 bg-background min-h-[300px]',
    skeletonTitleHeight: 'h-10',
    skeletonTitleWidth: 'w-64',
    skeletonTitleMb: 'mb-16',
    skeletonBarHeight: 'h-6',
  },
  light: {
    section: 'py-10 bg-[#FDFBF7] min-h-[200px]',
    header: 'mb-6',
    title: 'text-xl sm:text-2xl font-semibold text-[#141b2b] mb-2',
    subtitle: 'text-[#747872] text-sm',
    card: 'bg-white border-[#7d8c7b]/20',
    cardOpen: 'border-[#516050]/50 shadow-xl shadow-[#516050]/5 ring-1 ring-[#516050]/10',
    cardHover: 'hover:border-[#516050]/30',
    icon: 'bg-[#7d8c7b]/10 text-[#516050]',
    iconOpen: 'bg-[#516050] text-white',
    question: 'text-[#141b2b]',
    questionOpen: 'text-[#516050]',
    questionSize: 'text-base',
    chevron: 'text-[#747872]',
    answer: 'text-[#444842]',
    answerSize: 'text-sm',
    cta: 'mt-6 text-[#747872]',
    skeleton: 'bg-[#7d8c7b]/10',
    skeletonSection: 'py-10 bg-[#FDFBF7] min-h-[200px]',
    skeletonTitleHeight: 'h-8',
    skeletonTitleWidth: 'w-48',
    skeletonTitleMb: 'mb-6',
    skeletonBarHeight: 'h-5',
  },
};

const FaqSection: React.FC<FaqSectionProps> = ({ variant = 'default' }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expectedCount, setExpectedCount] = useState(0);
  const t = theme[variant];

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await faqService.getActiveFAQs();
      setExpectedCount(data.length);
      setFaqs(data);
      setLoading(false);
      
      // Abrir la primera pregunta por defecto si hay datos
      if (data.length > 0) {
        setOpenId(data[0]._id);
      }
    };
    loadFaqs();
  }, []);

  const toggleAccordion = (id: string, question: string) => {
    const isOpening = openId !== id;
    setOpenId(isOpening ? id : null);
    
    // Tracking GA4
    trackFaqInteraction(question, isOpening ? 'expand' : 'collapse');
  };

  // Esqueleto para evitar CLS (Cumulative Layout Shift)
  if (loading) {
    return (
      <section className={t.skeletonSection}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`${t.skeletonTitleHeight} ${t.skeleton} rounded-xl ${t.skeletonTitleWidth} mx-auto ${t.skeletonTitleMb} animate-pulse`}></div>
          <div className="space-y-4">
            {Array.from({ length: expectedCount || 3 }).map((_, i) => (
              <div 
                key={i} 
                className={`${i === 0 ? 'h-48' : 'h-20'} ${t.card} rounded-2xl border animate-pulse flex flex-col`}
              >
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-10 h-10 ${t.skeleton} rounded-xl`}></div>
                  <div className={`${t.skeletonBarHeight} ${t.skeleton} rounded-lg w-3/4`}></div>
                </div>
                {i === 0 && (
                  <div className="px-6 pb-6 pt-2 ml-14 space-y-2">
                    <div className={`h-4 ${t.skeleton} rounded w-full`}></div>
                    <div className={`h-4 ${t.skeleton} rounded w-5/6`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section className={t.section}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center ${t.header}`}>
          <h2 className={t.title}>
            Preguntas Frecuentes
          </h2>
          <p className={`${t.subtitle} max-w-2xl mx-auto`}>
            Resolvemos tus dudas para que puedas comenzar tu viaje en el mundo de la costura hoy mismo.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const IconComponent = ICON_MAP[faq.iconName] || QuestionMarkCircleIcon;
            const isOpen = openId === faq._id;

            return (
              <div 
                key={faq._id}
                className={`group ${t.card} border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? t.cardOpen
                    : t.cardHover
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq._id, faq.question)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors duration-300 ${
                      isOpen ? t.iconOpen : t.icon
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`font-semibold ${t.questionSize} transition-colors duration-300 ${
                      isOpen ? t.questionOpen : t.question
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 transition-transform duration-500 ${
                      isOpen ? `rotate-180 ${t.questionOpen}` : t.chevron
                    }`}
                  />
                </button>

                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 ml-14">
                    <div className={`${t.answer} ${t.answerSize} leading-relaxed whitespace-pre-line`}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`text-center ${t.cta}`}>
          <p className="italic">
            ¿Tienes otra duda? Escríbeme directamente por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
