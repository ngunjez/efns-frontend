import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { isLocale, localeCookie, negotiateLocale } from './config';
import { loadMessages } from './messages';

export default getRequestConfig(async () => {
  const stored = (await cookies()).get(localeCookie)?.value;
  const locale = isLocale(stored)
    ? stored
    : negotiateLocale((await headers()).get('accept-language'));
  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: 'Africa/Nairobi',
  };
});
