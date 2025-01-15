'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SupportedLanguage, defaultLanguage } from '../config/messages';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages: Record<SupportedLanguage, string> = {
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
  ka: 'ქართული'
};

export function LanguageToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value as SupportedLanguage;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newLang === defaultLanguage) {
      params.delete('hl');
    } else {
      params.set('hl', newLang);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
  }, [router, searchParams]);

  const currentLang = (searchParams.get('hl') as SupportedLanguage) || defaultLanguage;

  return (
    <div className="flex items-center gap-2">
      <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        className="bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        aria-label="Select language"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
} 