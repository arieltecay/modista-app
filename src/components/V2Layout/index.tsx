import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useRevealOnScroll } from '../../pages/LandingV2/hooks/use-reveal';

const WHATSAPP_URL = 'https://wa.me/5493815430670';

const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/cursos', label: 'Cursos' },
  { to: '/tarifario', label: 'Tarifario' },
  { to: '/sobre-mi', label: 'Sobre Mí' },
];

interface V2LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout compartido del sitio v2 ("Atelier Digital"): navbar completa
 * (desktop + menú mobile) y footer. Las landings de campaña NO lo usan
 * (diseño minimal sin distracciones, a propósito).
 */
const V2Layout: React.FC<V2LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Reveal on scroll centralizado: todas las páginas del sitio v2 lo heredan
  // (incluido contenido async que se monta después del primer render).
  useRevealOnScroll();

  return (
    <div className="min-h-screen bg-atelier-canvas text-atelier-ink antialiased">
      <header className="sticky top-0 z-40 bg-atelier-canvas/85 backdrop-blur-md border-b border-atelier-sage/15">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link to="/" className="font-atelier-serif text-2xl font-semibold text-atelier-ink tracking-tight" onClick={() => setMenuOpen(false)}>
            Modista<span className="text-atelier-pop">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 font-atelier-sans text-sm">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-atelier-primary font-semibold' : 'text-[#444842] hover:text-atelier-primary'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-atelier-primary hover:bg-atelier-primary-dark text-white text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded-full transition-all active:scale-[0.98]"
            >
              WhatsApp
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white/70 border border-atelier-sage/20"
          >
            <span className={`block w-5 h-0.5 bg-atelier-ink transition-transform ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-5 h-0.5 bg-atelier-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-atelier-ink transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-atelier-sage/15 bg-atelier-canvas px-5 py-4 flex flex-col gap-1 font-atelier-sans">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-2 rounded-xl text-base ${isActive ? 'text-atelier-primary font-semibold bg-atelier-primary/5' : 'text-[#444842]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-atelier-primary text-white text-center text-sm font-bold uppercase tracking-wide px-5 py-3.5 rounded-full"
            >
              Escribinos por WhatsApp
            </a>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-atelier-sage/15 py-8 text-center bg-atelier-canvas">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-atelier-sans text-sm text-atelier-muted-text">
          <span>&copy; {new Date().getFullYear()} Modista App · Tucumán, Argentina</span>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacidad" className="hover:text-atelier-primary transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-atelier-primary transition-colors">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default V2Layout;
