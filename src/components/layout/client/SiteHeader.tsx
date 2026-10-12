'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useClientSession, useClientSignOut } from '@/api/hooks/use-client';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageSwitch } from '@/components/common/LanguageSwitch';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { site } from '@/config/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const session = useClientSession();
  const signOut = useClientSignOut();
  const client = session.data;
  const [open, setOpen] = useState(false);

  const links: { href: Route; label: string }[] = [
    { href: '/#services', label: t('nav.services') },
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/#hubs', label: t('nav.hubs') },
    ...(client ? [{ href: '/my-application' as Route, label: t('nav.myApplication') }] : []),
  ];

  const leave = () =>
    signOut.mutate(undefined, {
      onSettled: () => {
        setOpen(false);
        router.push('/');
      },
    });

  const nav = (vertical?: boolean) => (
    <ul className={cn('flex gap-7 font-medium', vertical && 'flex-col gap-5 text-lg')}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={pathname === link.href ? 'page' : undefined}
            className="transition-colors hover:text-primary aria-[current=page]:text-primary"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const identity = client && (
    <span className="flex items-center gap-2.5 text-start">
      <Avatar name={client.name} />
      <span className="grid leading-tight">
        <span className="text-sm font-semibold">{client.name}</span>
        <span className="text-xs text-muted-foreground">{t('common.signedIn')}</span>
      </span>
    </span>
  );

  const account = session.isPending ? (
    <Skeleton className="h-10 w-48" />
  ) : client ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-control p-1 hover:bg-muted">
        {identity}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/my-application">
            <UserRound aria-hidden /> {t('nav.myApplication')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={leave}>
          <LogOut aria-hidden /> {t('common.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="flex h-16 items-center justify-between gap-4 px-gutter sm:h-20">
        <Link href="/" className="rounded-control">
          <Logo name={site.name} />
        </Link>
        <nav aria-label={t('nav.primary')} className="hidden lg:block">
          {nav()}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <ThemeToggle />
          <div className="hidden items-center gap-3 lg:flex">{account}</div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={t('common.openMenu')}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-80 gap-8 p-6 pt-16" aria-describedby={undefined}>
          <SheetTitle className="sr-only">{t('common.menu')}</SheetTitle>
          {identity}
          <nav aria-label={t('nav.primary')}>{nav(true)}</nav>
          <LanguageSwitch className="justify-self-start" />
          <div className="grid gap-3">
            {client ? (
              <Button variant="outline" onClick={leave} loading={signOut.isPending}>
                <LogOut aria-hidden /> {t('common.signOut')}
              </Button>
            ) : (
              account
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
