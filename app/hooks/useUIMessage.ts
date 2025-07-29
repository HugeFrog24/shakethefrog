'use client';

import { useLanguage } from './useLanguage';
import { getUIMessage } from '../config/ui-messages';
import { messageCases, MessageKey } from '../config/ui-messages';
import { useLocalizedSkinName, GrammaticalCase } from './useLocalizedSkinName';

/**
 * Hook to get localized UI messages
 * @param getLocalizedSkinNameFn Optional function to get localized skin names (for dependency injection)
 */
export function useUIMessage(getLocalizedSkinNameFn?: ReturnType<typeof useLocalizedSkinName>) {
  const language = useLanguage();
  // Always call the hook to follow React rules
  const localizedSkinNameHook = useLocalizedSkinName();
  // Use the provided function if available, otherwise use the hook's function
  const getLocalizedSkinName = getLocalizedSkinNameFn || localizedSkinNameHook;
  
  /**
   * Get a localized UI message with optional replacements
   * @param key The message key
   * @param replacements Optional object with replacement values for placeholders
   * @returns The localized message with replacements applied
   */
  const getMessage = (
    key: MessageKey,
    replacements?: Record<string, string | { id: string }>
  ) => {
    // Process replacements to handle skin names with correct grammatical cases
    const processedReplacements: Record<string, string> = {};
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        // If the value is a skin ID object, get the localized name with the correct case
        if (typeof value === 'object' && 'id' in value) {
          const skinId = value.id;
          // Get the grammatical case to use for this message and language
          const grammaticalCase = (messageCases[language]?.[key as MessageKey] || 'nominative') as GrammaticalCase;
          processedReplacements[placeholder] = getLocalizedSkinName(skinId, grammaticalCase);
        } else if (typeof value === 'string') {
          // Regular string replacement
          processedReplacements[placeholder] = value;
        }
      });
    }
    
    return getUIMessage(language, key, processedReplacements);
  };
  
  return getMessage;
}