import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'de', 'ru', 'ka', 'ar'] as const;
export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  // Load messages from both ui and character directories
  const [uiMessages, characterMessages] = await Promise.all([
    import(`../messages/ui/${locale}.json`),
    import(`../messages/character/${locale}.json`)
  ]);

  return {
    locale,
    messages: {
      ui: uiMessages.default,
      character: characterMessages.default
    }
  };
});