'use client';

import { useTranslations } from 'next-intl';
import { useBayDisplay } from '@/api/hooks/use-displays';

export function BayDisplay({ bay }: { bay: string }) {
  const t = useTranslations('display');
  const { data } = useBayDisplay(bay);

  return (
    <main id="main" className="grid min-h-dvh content-start bg-card p-gutter">
      <div className="flex flex-wrap items-start justify-between gap-8 border-b pb-8">
        <div className="grid">
          <span className="text-h2 text-muted-foreground">{t('bay')}</span>
          <span className="text-jumbo font-bold">{data?.bay ?? bay}</span>
        </div>
        <div className="grid text-end" aria-live="assertive">
          <span className="text-h2 text-muted-foreground">{t('nowServing')}</span>
          <span className="text-jumbo font-bold tabular">{data?.ticket ?? '—'}</span>
        </div>
      </div>
      {!data?.ticket && <p className="pt-8 text-h3 text-muted-foreground">{t('waiting')}</p>}
    </main>
  );
}
