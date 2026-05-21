import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { GiSewingMachine } from "react-icons/gi";
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

interface NavItem {
  name: string;
  href: string;
}

const navigation: NavItem[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Tarifas', href: '/tarifario' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Sobre Mí', href: '/sobre-mi' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) {
      openMenuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  return (
    <header className="bg-background/90 backdrop-blur border border-border rounded-2xl shadow-sm mt-4 mx-4 sticky top-0 z-50 transition-colors duration-250">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <NavLink to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <GiSewingMachine className="h-8 w-auto text-primary" />
            <div className="w-40 h-10 relative">
               <img 
                 src="https://res.cloudinary.com/ddfee9hht/image/upload/v1775248530/modista_app/Micaela%20MARCA%20DE%20AGUA.png" 
                 alt="Micaela Modista" 
                 className="h-10 w-auto object-contain -ml-2 dark:brightness-110 dark:contrast-125" 
               />
            </div>
          </NavLink>
        </div>
        <div className="flex lg:hidden items-center gap-4">
          <ThemeToggle />
          <button
            ref={openMenuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-12">
          <div className="flex gap-x-12">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `relative text-base font-semibold leading-6 text-foreground transition-colors duration-200 px-2 py-1 rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive ? 'text-primary' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="transition-all duration-200 group-hover:underline">{item.name}</span>
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className="h-6 w-px bg-border mx-2" />
          <ThemeToggle />
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border transition-colors duration-250">
          <div className="flex items-center justify-between">
            <NavLink to="/" tabIndex={mobileMenuOpen ? 0 : -1} className="-m-1.5 p-1.5 flex items-center space-x-2">
              <GiSewingMachine className="h-8 w-auto text-primary" />
              <div className="w-40 h-10 relative">
                <img 
                  src="https://res.cloudinary.com/ddfee9hht/image/upload/v1775248530/modista_app/Micaela%20MARCA%20DE%20AGUA.png" 
                  alt="Micaela Modista" 
                  className="h-10 w-auto object-contain -ml-2 dark:brightness-110 dark:contrast-125" 
                />
              </div>
            </NavLink>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-12">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive ? 'bg-primary/10 text-primary' : ''
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
