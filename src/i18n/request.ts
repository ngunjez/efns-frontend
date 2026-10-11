import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isLocale, localeCookie } from './config';

/**
 * Locale comes from a cookie rather than the URL: hub screens are switched by
 * the officer for the client in front of them, and links shared by SMS must
 * work in any language.
 */
export default getRequestConfig(async () => {
  const stored = (await cookies()).get(localeCookie)?.value;
  const locale = isLocale(stored) ? stored : defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Africa/Nairobi',
  };
});
