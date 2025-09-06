// Define supported languages
import { SupportedLanguage, defaultLanguage } from './messages';
import { GrammaticalCase } from '../hooks/useLocalizedSkinName';

// Define message key type for better type safety
// We need to define these keys explicitly to avoid circular references
export type MessageKey = 'enableDeviceShake' | 'shakeInstructionsMobile' |
                        'shakeInstructionsDesktop' | 'noShakeInstructionsMobile' |
                        'noShakeInstructionsDesktop';

// Define which grammatical case to use for each language and message
export const messageCases: Record<SupportedLanguage, Partial<Record<MessageKey, GrammaticalCase>>> = {
  en: {}, // English doesn't use cases
  de: {}, // German uses cases but we'll handle it directly in the messages
  ru: {
    // For Russian, specify which case to use for the {item} placeholder in each message
    shakeInstructionsMobile: 'accusative',
    shakeInstructionsDesktop: 'accusative',
    noShakeInstructionsMobile: 'accusative',
    noShakeInstructionsDesktop: 'accusative'
  },
  ka: {
    // For Georgian, specify which case to use for the {item} placeholder in each message
    shakeInstructionsMobile: 'accusative',
    shakeInstructionsDesktop: 'accusative',
    noShakeInstructionsMobile: 'accusative',
    noShakeInstructionsDesktop: 'accusative'
  },
  ar: {} // Arabic has cases but we'll handle it directly in the messages
};

// UI messages for different languages
export const uiMessages: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    enableDeviceShake: "Enable device shake",
    // Mobile version
    shakeInstructionsMobile: "Shake your device or click/tap {item}!",
    // Desktop version
    shakeInstructionsDesktop: "Shake your device, press spacebar, or click/tap {item}!",
    // Mobile version (no shake)
    noShakeInstructionsMobile: "Click/tap {item}!",
    // Desktop version (no shake)
    noShakeInstructionsDesktop: "Press spacebar or click/tap {item}!"
  },
  de: {
    enableDeviceShake: "Geräte-Schütteln aktivieren",
    // Mobile version
    shakeInstructionsMobile: "Schüttle dein Gerät oder klicke/tippe auf {item}!",
    // Desktop version
    shakeInstructionsDesktop: "Schüttle dein Gerät, drücke die Leertaste, oder klicke/tippe auf {item}!",
    // Mobile version (no shake)
    noShakeInstructionsMobile: "Klicke/tippe auf {item}!",
    // Desktop version (no shake)
    noShakeInstructionsDesktop: "Drücke die Leertaste oder klicke/tippe auf {item}!"
  },
  ru: {
    enableDeviceShake: "Включить встряску устройства",
    // Mobile version
    shakeInstructionsMobile: "Встряхните устройство или нажмите/коснитесь {item}!",
    // Desktop version
    shakeInstructionsDesktop: "Встряхните устройство, нажмите пробел, или нажмите/коснитесь {item}!",
    // Mobile version (no shake)
    noShakeInstructionsMobile: "Нажмите/коснитесь {item}!",
    // Desktop version (no shake)
    noShakeInstructionsDesktop: "Нажмите пробел или нажмите/коснитесь {item}!"
  },
  ka: {
    enableDeviceShake: "მოწყობილობის შერყევის ჩართვა",
    // Mobile version
    shakeInstructionsMobile: "შეარხიეთ თქვენი მოწყობილობა ან დააწკაპუნეთ/შეეხეთ {item}!",
    // Desktop version
    shakeInstructionsDesktop: "შეარხიეთ თქვენი მოწყობილობა, დააჭირეთ Space-ს, ან დააწკაპუნეთ/შეეხეთ {item}!",
    // Mobile version (no shake)
    noShakeInstructionsMobile: "დააწკაპუნეთ/შეეხეთ {item}!",
    // Desktop version (no shake)
    noShakeInstructionsDesktop: "დააჭირეთ Space-ს ან დააწკაპუნეთ/შეეხეთ {item}!"
  },
  ar: {
    enableDeviceShake: "تفعيل هز الجهاز",
    // Mobile version
    shakeInstructionsMobile: "هز جهازك أو انقر/المس {item}!",
    // Desktop version
    shakeInstructionsDesktop: "هز جهازك، اضغط على مفتاح المسافة، أو انقر/المس {item}!",
    // Mobile version (no shake)
    noShakeInstructionsMobile: "انقر/المس {item}!",
    // Desktop version (no shake)
    noShakeInstructionsDesktop: "اضغط على مفتاح المسافة أو انقر/المس {item}!"
  }
};

// Function to get a UI message with placeholders replaced
export function getUIMessage(
  lang: SupportedLanguage, 
  key: keyof typeof uiMessages[typeof defaultLanguage],
  replacements?: Record<string, string>
): string {
  // Get the message for the specified language or fall back to default
  const message = uiMessages[lang]?.[key] || uiMessages[defaultLanguage][key];
  
  // If no replacements, return the message as is
  if (!replacements) {
    return message;
  }
  
  // Replace placeholders with values
  return Object.entries(replacements).reduce(
    (result, [placeholder, value]) => result.replace(`{${placeholder}}`, value),
    message
  );
}