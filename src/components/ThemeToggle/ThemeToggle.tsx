import React from 'react';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
      aria-label="Cambiar tema visual"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="light"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BsSunFill className="w-5 h-5 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            key="dark"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BsMoonFill className="w-4 h-4 text-blue-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
