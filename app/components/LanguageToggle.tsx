'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '../../i18n/routing';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type Locale = 'en' | 'de' | 'ru' | 'ka' | 'ar';

interface LanguageOption {
  code: Locale;
  name: string;
}

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const t = useTranslations('ui');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locales: Locale[] = ['en', 'de', 'ru', 'ka', 'ar'];

  const languageOptions: LanguageOption[] = locales.map((code) => ({
    code,
    name: t(`languages.${code}`)
  }));

  const currentLanguage = languageOptions.find(lang => lang.code === locale) || languageOptions[0];

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('languageSelector')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeAltIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[60px] text-left hidden min-[360px]:block">
          {currentLanguage.name}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {languageOptions.map((option) => (
              <Link
                key={option.code}
                href="/"
                locale={option.code}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  locale === option.code
                    ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                role="menuitem"
              >
                <GlobeAltIcon className={`w-4 h-4 ${
                  locale === option.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span>{option.name}</span>
                {locale === option.code && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
