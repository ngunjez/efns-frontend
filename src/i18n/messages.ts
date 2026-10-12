import type { AbstractIntlMessages } from 'next-intl';
import { defaultLocale, type Locale } from './config';

type Messages = AbstractIntlMessages;

function merge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    result[key] =
      value && typeof value === 'object' && current && typeof current === 'object'
        ? merge(current as Messages, value as Messages)
        : value;
  }
  return result;
}

async function load(locale: Locale): Promise<Messages> {
  return (await import(`../../messages/${locale}.json`)).default as Messages;
}

export async function loadMessages(locale: Locale): Promise<Messages> {
  const fallback = await load(defaultLocale);
  return locale === defaultLocale ? fallback : merge(fallback, await load(locale));
}
