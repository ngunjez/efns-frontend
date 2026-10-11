'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { setLocale } from '@/i18n/actions';
import { localeLabels, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

/** English | Kiswahili — on every client-facing screen. Persists in a cookie. */
export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: string) =>
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });

  return (
    <RadioGroupPrimitive.Root
      aria-label="Language"
      orientation="horizontal"
      value={locale}
      onValueChange={change}
      disabled={pending}
      className={cn(
        'inline-flex overflow-hidden rounded-control border bg-card text-sm font-semibold',
        className,
      )}
    >
      {locales.map((code) => (
        <RadioGroupPrimitive.Item
          key={code}
          value={code}
          lang={code}
          className="px-3 py-2 transition-colors hover:bg-muted data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground sm:px-4"
        >
          {localeLabels[code]}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
