// Define supported languages
export type SupportedLanguage = 'en' | 'de' | 'ru' | 'ka' | 'ar';

// Define the message structure
export const defaultLanguage: SupportedLanguage = 'en';

// Cache for loaded messages
const messageCache: Partial<Record<SupportedLanguage, string[]>> = {};

// Function to load messages for a specific language
export async function loadMessages(lang: SupportedLanguage): Promise<string[]> {
  if (messageCache[lang]) {
    return messageCache[lang]!;
  }

  try {
    const messages = await import(`./messages/${lang}.json`);
    messageCache[lang] = messages.default;
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for language ${lang}:`, error);
    // Fallback to English if loading fails
    if (lang !== defaultLanguage) {
      return loadMessages(defaultLanguage);
    }
    return [];
  }
}

// Export type for TypeScript type checking
export type FrogMessages = Record<SupportedLanguage, string[]>;

// Initialize with empty arrays, will be populated on demand
export const frogMessages: FrogMessages = {
  en: [],
  de: [],
  ru: [],
  ka: [],
  ar: []
};

// Preload default language
loadMessages(defaultLanguage).then(messages => {
  frogMessages[defaultLanguage] = messages;
}).catch(console.error);