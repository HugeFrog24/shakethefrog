'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '../providers/ThemeProvider';
import { SunIcon, MoonIcon, ComputerDesktopIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOption {
  mode: ThemeMode;
  label: string;
  icon: React.ReactNode;
}

export function ThemeToggle() {
  const { themeMode, setThemeMode } = useTheme();
  const t = useTranslations('ui');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themeOptions: ThemeOption[] = [
    {
      mode: 'light',
      label: t('themes.light'),
      icon: <SunIcon className="w-4 h-4" />
    },
    {
      mode: 'dark',
      label: t('themes.dark'),
      icon: <MoonIcon className="w-4 h-4" />
    },
    {
      mode: 'system',
      label: t('themes.system'),
      icon: <ComputerDesktopIcon className="w-4 h-4" />
    }
  ];

  // Get current theme option
  const currentTheme = themeOptions.find(option => option.mode === themeMode) || themeOptions[2];

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main toggle button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors z-50"
        aria-label={t('themeSelector')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          {currentTheme.icon}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[60px] text-left hidden min-[360px]:block">
          {currentTheme.label}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {themeOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => handleThemeSelect(option.mode)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  themeMode === option.mode
                    ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                role="menuitem"
              >
                <div className={themeMode === option.mode ? 'text-blue-600 dark:text-blue-400' : ''}>
                  {option.icon}
                </div>
                <span>{option.label}</span>
                {themeMode === option.mode && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
