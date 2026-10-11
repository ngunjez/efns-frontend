export const locales = ['en', 'sw', 'fr', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeCookie = 'NEXT_LOCALE';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  sw: 'Kiswahili',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
