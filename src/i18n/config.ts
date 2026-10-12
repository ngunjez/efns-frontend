import { languages, type Language, type Locale } from './languages';

export type { Locale };

export const locales = languages.map((language) => language.code) as Locale[];
export const defaultLocale: Locale = 'en';
export const localeCookie = 'NEXT_LOCALE';

const byCode = new Map<string, Language>(languages.map((language) => [language.code, language]));

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && byCode.has(value));
}

export function languageOf(locale: string): Language {
  return byCode.get(locale) ?? byCode.get(defaultLocale)!;
}

export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((part) => {
      const [tag = '', quality] = part.trim().split(';q=');
      return { tag: tag.toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);
  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
