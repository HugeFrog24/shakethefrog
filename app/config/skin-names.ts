import { SupportedLanguage } from './messages';

// Define grammatical cases for languages that need them
type GrammaticalCase = 'nominative' | 'accusative' | 'dative' | 'genitive' | 'instrumental' | 'prepositional';

// Define which languages need grammatical cases
const languagesWithCases: Partial<Record<SupportedLanguage, boolean>> = {
  ru: true,
  ka: true
};

// Localized skin names for different languages with grammatical cases
export const skinNames: Record<string, Record<SupportedLanguage, string | Record<GrammaticalCase, string>>> = {
  frog: {
    en: 'Frog',
    de: 'Frosch',
    ru: {
      nominative: 'Лягушка',
      accusative: 'Лягушку',
      dative: 'Лягушке',
      genitive: 'Лягушки',
      instrumental: 'Лягушкой',
      prepositional: 'Лягушке'
    },
    ka: {
      nominative: 'ბაყაყი',
      accusative: 'ბაყაყს',
      dative: 'ბაყაყს',
      genitive: 'ბაყაყის',
      instrumental: 'ბაყაყით',
      prepositional: 'ბაყაყზე'
    },
    ar: 'ضفدع'
  },
  mandarin: {
    en: 'Mandarin',
    de: 'Mandarine',
    ru: {
      nominative: 'Мандарин',
      accusative: 'Мандарин',
      dative: 'Мандарину',
      genitive: 'Мандарина',
      instrumental: 'Мандарином',
      prepositional: 'Мандарине'
    },
    ka: {
      nominative: 'მანდარინი',
      accusative: 'მანდარინს',
      dative: 'მანდარინს',
      genitive: 'მანდარინის',
      instrumental: 'მანდარინით',
      prepositional: 'მანდარინზე'
    },
    ar: 'ماندرين'
  }
};

/**
 * Get the localized name for a skin with the appropriate grammatical case
 * @param skinId The skin ID
 * @param language The language code
 * @param grammaticalCase The grammatical case to use (for languages that need it)
 * @returns The localized skin name
 */
export function getLocalizedSkinName(
  skinId: string,
  language: SupportedLanguage,
  grammaticalCase: GrammaticalCase = 'nominative'
): string {
  const skinName = skinNames[skinId]?.[language];
  
  // If the language doesn't use cases or we don't have cases for this skin
  if (!skinName || typeof skinName === 'string' || !languagesWithCases[language]) {
    return typeof skinName === 'string' ? skinName : skinNames[skinId]?.en as string || skinId;
  }
  
  // Return the appropriate case, or fallback to nominative if the case doesn't exist
  return skinName[grammaticalCase] || skinName.nominative;
}