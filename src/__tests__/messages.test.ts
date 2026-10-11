import { locales } from '@/i18n/config';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import pt from '../../messages/pt.json';
import sw from '../../messages/sw.json';

const catalogues: Record<string, unknown> = { en, sw, fr, es, pt };

const keys = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) =>
        keys(child, prefix ? `${prefix}.${key}` : key),
      )
    : [prefix];

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)[,}]/g)].map((match) => match[1]).sort();

const leaves = (value: unknown, prefix = ''): [string, string][] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) =>
        leaves(child, prefix ? `${prefix}.${key}` : key),
      )
    : [[prefix, String(value)]];

describe.each(locales.filter((locale) => locale !== 'en'))('%s translations', (locale) => {
  const messages = catalogues[locale];

  it('exists for every configured locale', () => {
    expect(messages).toBeDefined();
  });

  it('has exactly the English keys', () => {
    expect(keys(messages).sort()).toEqual(keys(en).sort());
  });

  it('keeps every placeholder', () => {
    const translated = new Map(leaves(messages));
    leaves(en).forEach(([key, text]) =>
      expect([key, placeholders(translated.get(key) ?? '')]).toEqual([key, placeholders(text)]),
    );
  });
});
