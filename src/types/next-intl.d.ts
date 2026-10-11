import type messages from '../../messages/en.json';
import type { Locale } from '@/i18n/config';

/** Typed translation keys: a missing or misspelt key is a compile error. */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
