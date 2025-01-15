'use client';

import { useTheme } from '../providers/ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors z-50"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <SunIcon className="w-6 h-6 text-yellow-500" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-900" />
      )}
    </button>
  );
}
