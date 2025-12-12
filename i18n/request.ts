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
  // Read how to split localization files here:
  // https://next-intl.dev/docs/usage/configuration#messages-split-files
  const messages = {
    ui: (await import(`../messages/ui/${locale}.json`)).default,
    character: (await import(`../messages/character/${locale}.json`)).default
  };

  return {
    locale,
    messages
  };
});