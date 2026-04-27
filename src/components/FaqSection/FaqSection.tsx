import React, { useState, useEffect } from 'react';
import { faqService, FAQ } from '../../services/faq/faqService';
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

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await faqService.getActiveFAQs();
      setFaqs(data);
      setLoading(false);
      
      // Abrir la primera pregunta por defecto si hay datos
      if (data.length > 0) {
        setOpenId(data[0]._id);
      }
    };
    loadFaqs();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) return null;
  if (faqs.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
                className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-indigo-200 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-50' 
                    : 'border-gray-100 hover:border-indigo-100 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq._id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors duration-300 ${
                      isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`font-semibold text-lg transition-colors duration-300 ${
                      isOpen ? 'text-indigo-900' : 'text-gray-700'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 ml-14">
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 italic">
            ¿Tienes otra duda? Escríbeme directamente por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
