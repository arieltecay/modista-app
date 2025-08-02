import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaCut } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Sobre Mí', href: '/sobre-mi' },
  { name: 'Contacto', href: '/contacto' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-sm mt-4 mx-4">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <FaCut className="h-8 w-auto text-[var(--color-green-600)]" />
            <span className="text-xl font-bold text-gray-900">ModistaApp</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="relative text-base font-semibold leading-6 text-gray-900 transition-colors duration-200 px-2 py-1 rounded-md hover:text-[var(--color-green-600)] hover:bg-[var(--color-green-600)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green-600)]"
            >
              <span className="transition-all duration-200 group-hover:underline">{item.name}</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[var(--color-green-600)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <FaCut className="h-8 w-auto text-[var(--color-green-600)]" />
              <span className="text-xl font-bold text-gray-900">ModistaApp</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 transition-colors duration-200 hover:bg-[var(--color-green-600)]/10 hover:text-[var(--color-green-600)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green-600)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}