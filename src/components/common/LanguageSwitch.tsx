'use client';

import { useId, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown, Globe, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setLocale } from '@/i18n/actions';
import { languageOf } from '@/i18n/config';
import { languages } from '@/i18n/languages';
import { cn } from '@/lib/utils';

export function LanguageSwitch({ className }: { className?: string }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [pending, startTransition] = useTransition();
  const current = languageOf(locale);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    return term
      ? languages.filter((language) =>
          `${language.name} ${language.nativeName} ${language.code}`.toLowerCase().includes(term),
        )
      : languages;
  }, [filter]);

  const choose = (code: string) => {
    setOpen(false);
    setFilter('');
    if (code === locale) return;
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
      await queryClient.invalidateQueries();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={t('language')}
        disabled={pending}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-control border bg-card px-3 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60',
          className,
        )}
      >
        <Globe className="size-4 text-muted-foreground" aria-hidden />
        <span lang={current.code}>{current.nativeName}</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <label className="relative mb-2 block">
          <span className="sr-only">{t('searchLanguages')}</span>
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && visible[0]) choose(visible[0].code);
            }}
            placeholder={t('searchLanguages')}
            aria-controls={listId}
            className="h-9 w-full rounded-control border bg-card ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
          />
        </label>
        <ul
          id={listId}
          role="listbox"
          aria-label={t('language')}
          className="grid max-h-72 overflow-y-auto"
        >
          {visible.map((language) => {
            const selected = language.code === locale;
            return (
              <li key={language.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  lang={language.code}
                  dir={language.dir}
                  onClick={() => choose(language.code)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-control px-3 py-2 text-start text-sm hover:bg-muted',
                    selected && 'bg-primary-tint font-semibold text-primary',
                  )}
                >
                  <span className="grid leading-tight">
                    <span>{language.nativeName}</span>
                    {language.nativeName !== language.name && (
                      <span className="text-xs text-muted-foreground" lang="en">
                        {language.name}
                      </span>
                    )}
                  </span>
                  {selected && <Check className="size-4" aria-hidden />}
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">{t('noLanguage')}</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
