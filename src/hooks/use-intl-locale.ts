import { useLocale } from 'next-intl';
import { languageOf } from '@/i18n/config';

export function useIntlLocale() {
  return languageOf(useLocale()).intl;
}
