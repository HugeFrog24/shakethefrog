'use client';

import { useSearchParams } from 'next/navigation';
import { SupportedLanguage, defaultLanguage, frogMessages } from '../config/messages';

export function useLanguage(): SupportedLanguage {
  const searchParams = useSearchParams();
  const lang = searchParams.get('hl') as SupportedLanguage;
  
  // Check if the language is supported, otherwise return default
  return lang && Object.keys(frogMessages).includes(lang) ? lang : defaultLanguage;
} 