'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setLocale } from '@/i18n/actions';
import { localeLabels, locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

export function LanguageSwitch({ className }: { className?: string }) {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();

  const change = (next: string) =>
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
      await queryClient.invalidateQueries();
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('language')}
        disabled={pending}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-control border bg-card px-3 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60',
          className,
        )}
      >
        <Globe className="size-4 text-muted-foreground" aria-hidden />
        <span lang={locale}>{localeLabels[locale]}</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuRadioGroup value={locale} onValueChange={change}>
          {locales.map((code) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              lang={code}
              className="justify-between pl-3"
            >
              {localeLabels[code]}
              {code === locale && <Check className="text-primary" aria-hidden />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
