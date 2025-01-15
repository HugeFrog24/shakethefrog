// Define supported languages
export type SupportedLanguage = 'en' | 'de' | 'ru' | 'ka';

// Define the message structure
export const defaultLanguage: SupportedLanguage = 'en';

// Import messages from JSON
import messagesData from './messages.json';

// Type assertion to ensure the JSON matches our expected structure
export const frogMessages: Record<SupportedLanguage, string[]> = messagesData as Record<SupportedLanguage, string[]>;

// For TypeScript type checking
export type FrogMessages = typeof frogMessages;