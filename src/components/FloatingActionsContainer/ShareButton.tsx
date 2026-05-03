import React from 'react';
import { HiShare } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { sendAnalyticsEvent, AnalyticsEvents } from '../../services/analytics';

const ShareButton: React.FC = () => {
  const handleShare = async () => {
    const shareData = {
      title: document.title,
      url: window.location.href,
    };

    // Tracking del evento antes de la acción
    sendAnalyticsEvent(AnalyticsEvents.BUTTON_CLICK, {
      button_name: 'Share Course',
      button_location: 'Floating Actions Group',
      share_url: window.location.href
    });

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('¡Enlace copiado al portapapeles!', {
          icon: '🔗',
          style: {
            borderRadius: '1rem',
            background: '#333',
            color: '#fff',
            fontWeight: 'bold'
          },
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('No se pudo compartir el enlace');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center w-12 h-12 bg-white text-indigo-600 rounded-full shadow-2xl border border-indigo-50 hover:bg-indigo-50 hover:scale-110 transition-all duration-300 active:scale-95 animate-in fade-in zoom-in duration-500"
      aria-label="Compartir curso"
      title="Compartir curso"
    >
      <HiShare className="w-6 h-6" />
    </button>
  );
};

export default ShareButton;
