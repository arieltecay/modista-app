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

const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expectedCount, setExpectedCount] = useState(0);

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
      <section className="py-20 bg-background min-h-[300px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-10 bg-muted rounded-xl w-64 mx-auto mb-16 animate-pulse"></div>
          <div className="space-y-4">
            {Array.from({ length: expectedCount || 3 }).map((_, i) => (
              <div 
                key={i} 
                className={`${i === 0 ? 'h-48' : 'h-20'} bg-card rounded-2xl border border-border animate-pulse flex flex-col`}
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 bg-muted rounded-xl"></div>
                  <div className="h-6 bg-muted rounded-lg w-3/4"></div>
                </div>
                {i === 0 && (
                  <div className="px-6 pb-6 pt-2 ml-14 space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
                className={`group bg-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/10' 
                    : 'border-border hover:border-primary/30 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq._id, faq.question)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors duration-300 ${
                      isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`font-semibold text-lg transition-colors duration-300 ${
                      isOpen ? 'text-primary' : 'text-foreground'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-500 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 ml-14">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic">
            ¿Tienes otra duda? Escríbeme directamente por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
