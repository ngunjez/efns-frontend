import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { locales, negotiateLocale } from '@/i18n/config';

const dir = join(process.cwd(), 'messages');
const read = (locale: string) =>
  JSON.parse(readFileSync(join(dir, `${locale}.json`), 'utf8')) as unknown;
const en = read('en');

const leaves = (value: unknown, prefix = ''): [string, string][] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) =>
        leaves(child, prefix ? `${prefix}.${key}` : key),
      )
    : [[prefix, String(value)]];

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)[,}]/g)].map((match) => match[1]).sort();

describe('language registry', () => {
  it('has a catalogue for every language and no stray catalogues', () => {
    const files = readdirSync(dir)
      .map((file) => file.replace(/\.json$/, ''))
      .sort();
    expect(files).toEqual([...locales].sort());
  });

  it('negotiates from the browser language, falling back to English', () => {
    expect(negotiateLocale('fr-CA,fr;q=0.9,en;q=0.8')).toBe('fr');
    expect(negotiateLocale('nl-NL,de;q=0.7')).toBe('de');
    expect(negotiateLocale('xx')).toBe('en');
    expect(negotiateLocale(null)).toBe('en');
  });
});

describe.each(locales.filter((locale) => locale !== 'en'))('%s catalogue', (locale) => {
  const messages = new Map(leaves(read(locale)));

  it('translates every English key and nothing more', () => {
    expect([...messages.keys()].sort()).toEqual(
      leaves(en)
        .map(([key]) => key)
        .sort(),
    );
  });

  it('keeps every placeholder', () => {
    leaves(en).forEach(([key, text]) =>
      expect([key, placeholders(messages.get(key) ?? '')]).toEqual([key, placeholders(text)]),
    );
  });
});
