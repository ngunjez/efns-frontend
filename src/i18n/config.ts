/**
 * Client-facing languages. Adding French, Spanish or Italian is: add the code
 * here, add messages/<code>.json, done — the switcher and loader read this list.
 */
export const locales = ['en', 'sw'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeCookie = 'NEXT_LOCALE';

export const localeLabels: Record<Locale, string> = { en: 'English', sw: 'Kiswahili' };

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
