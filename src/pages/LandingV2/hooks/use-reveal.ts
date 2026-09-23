import { useEffect } from 'react';

/**
 * Reveal on scroll para elementos con clase `.reveal`:
 * agrega `.is-visible` cuando entran al viewport.
 *
 * Implementación robusta para contenido ASYNC: además de IntersectionObserver
 * para el reveal, un MutationObserver capta elementos `.reveal` que se monten
 * después (listas que cargan del API, secciones lazy). Sin esto, las cards de
 * cursos quedaban invisibles al renderizarse fuera del primer frame.
 *
 * Llamarlo una sola vez por página/layout raíz. Es idempotente y seguro.
 */
export const useRevealOnScroll = (): void => {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    const scanned = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (scanned.has(el)) return;
        scanned.add(el);
        io.observe(el);
      });
    };

    // Rescaneo cuando el DOM cambia (contenido async de APIs)
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
};
