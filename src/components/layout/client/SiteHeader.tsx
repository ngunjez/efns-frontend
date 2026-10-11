'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useClientSession } from '@/api/hooks/use-client';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { LanguageSwitch } from '@/components/common/LanguageSwitch';
import { Logo } from '@/components/common/Logo';
import { site } from '@/config/site';
import { cn } from '@/lib/utils';

/** Public header (frames 90, 89, 38): navigation, language and account. */
export function SiteHeader({ minimal }: { minimal?: boolean }) {
  const t = useTranslations();
  const pathname = usePathname();
  const { data: client } = useClientSession();
  const [open, setOpen] = useState(false);

  const links: { href: Route; label: string }[] = [
    { href: '/#services', label: t('nav.services') },
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/#hubs', label: t('nav.hubs') },
    ...(client ? [{ href: '/my-application' as Route, label: t('nav.myApplication') }] : []),
  ];

  const nav = (vertical?: boolean) => (
    <ul className={cn('flex gap-7 font-medium', vertical && 'flex-col gap-5 text-lg')}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={pathname === link.href ? 'page' : undefined}
            className="hover:text-primary aria-[current=page]:text-primary"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const account = client ? (
    <span className="flex items-center gap-2.5">
      <Avatar name={client.name} />
      <span className="grid leading-tight">
        <span className="text-sm font-semibold">{client.name}</span>
        <span className="text-xs text-muted-foreground">{t('common.signedIn')}</span>
      </span>
    </span>
  ) : (
    <>
      <Button asChild variant="outline">
        <Link href="/sign-in">{t('common.signIn')}</Link>
      </Button>
      <Button asChild>
        <Link href="/create-account">{t('common.createAccount')}</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-gutter sm:h-20">
        <Link href="/" className="rounded-control">
          <Logo name={site.name} />
        </Link>
        {!minimal && (
          <nav aria-label={t('nav.primary')} className="hidden lg:block">
            {nav()}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <LanguageSwitch className="hidden sm:inline-flex" />
          {!minimal && <div className="hidden items-center gap-3 lg:flex">{account}</div>}
          {!minimal && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
          )}
          {minimal && <LanguageSwitch className="sm:hidden" />}
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-80 gap-8 p-6 pt-16" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav aria-label={t('nav.primary')}>{nav(true)}</nav>
          <LanguageSwitch />
          <div className="grid gap-3">{account}</div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
