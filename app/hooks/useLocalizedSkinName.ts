'use client';

import { useLocale } from 'next-intl';
import { getLocalizedSkinName } from '../config/skin-names';
import { type Locale } from '../../i18n/request';

// Define grammatical cases
type GrammaticalCase = 'nominative' | 'accusative' | 'dative' | 'genitive' | 'instrumental' | 'prepositional';

/**
 * Hook to get localized skin names
 */
export function useLocalizedSkinName() {
  const locale = useLocale();
  
  /**
   * Get a localized skin name with the appropriate grammatical case
   * @param skinId The skin ID
   * @param grammaticalCase The grammatical case to use (for languages that need it)
   * @returns The localized skin name
   */
  const getLocalizedName = (skinId: string, grammaticalCase: GrammaticalCase = 'nominative'): string => {
    return getLocalizedSkinName(skinId, locale as Locale, grammaticalCase);
  };
  
  return getLocalizedName;
}