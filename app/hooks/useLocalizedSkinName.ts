'use client';

import { useLanguage } from './useLanguage';
import { getLocalizedSkinName } from '../config/skin-names';

// Define grammatical cases
export type GrammaticalCase = 'nominative' | 'accusative' | 'dative' | 'genitive' | 'instrumental' | 'prepositional';

/**
 * Hook to get localized skin names
 */
export function useLocalizedSkinName() {
  const language = useLanguage();
  
  /**
   * Get a localized skin name with the appropriate grammatical case
   * @param skinId The skin ID
   * @param grammaticalCase The grammatical case to use (for languages that need it)
   * @returns The localized skin name
   */
  const getLocalizedName = (skinId: string, grammaticalCase: GrammaticalCase = 'nominative'): string => {
    return getLocalizedSkinName(skinId, language, grammaticalCase);
  };
  
  return getLocalizedName;
}