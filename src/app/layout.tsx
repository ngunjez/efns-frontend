import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Providers } from '@/components/providers/Providers';
import { site } from '@/config/site';
import './globals.css';

/**
 * Self-hosted, not Google Fonts: hub networks have no public internet breakout
 * (concept doc §5), so every asset must come from the platform itself.
 */
const outfit = localFont({
  src: '../assets/fonts/Outfit-Variable.woff2',
  variable: '--font-outfit',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description:
    'Government services, finished in one visit. Walk in to any accredited hub, or book a time.',
};

export const viewport: Viewport = {
  themeColor: '#2f7df6',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={outfit.variable} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
