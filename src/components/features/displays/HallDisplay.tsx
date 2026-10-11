'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Bell } from 'lucide-react';
import { useHallDisplay } from '@/api/hooks/use-displays';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { HubScreenHeader } from '@/components/layout/client/HubScreenHeader';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CalledTicket } from '@/types/domain';

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <time
      suppressHydrationWarning
      dateTime={now.toISOString()}
      className="text-2xl font-bold tabular"
    >
      {formatTime(now)}
    </time>
  );
}

/** Frame 21: the waiting-hall screen. Calls are also read aloud in Kiswahili and English. */
export function HallDisplay() {
  const t = useTranslations('display');
  const query = useHallDisplay();

  return (
    <div className="flex min-h-dvh flex-col">
      <HubScreenHeader
        hubName={query.data?.hubName ?? ''}
        subtitle="AaaS, government services"
        end={<Clock />}
      />
      <main id="main" className="grid flex-1 content-start gap-4 p-gutter">
        <QueryState query={query} loading={<LoadingBlock rows={5} />}>
          {(view) => (
            <>
              <p
                className="flex items-center gap-3 rounded-card bg-warning-tint px-5 py-3 text-lg"
                aria-live="assertive"
              >
                <Bell className="size-5 shrink-0" aria-hidden />
                <strong>{t('nowCalling')}</strong> {view.announcement}
              </p>
              <CallRow ticket={view.now} current />
              <ol className="grid gap-3">
                {view.recent.map((ticket) => (
                  <li key={ticket.number}>
                    <CallRow ticket={ticket} />
                  </li>
                ))}
              </ol>
            </>
          )}
        </QueryState>
      </main>
    </div>
  );
}

function CallRow({ ticket, current }: { ticket: CalledTicket; current?: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-card px-6 sm:grid-cols-[1fr_auto_1fr_1fr]',
        current ? 'bg-primary py-6 text-primary-foreground sm:py-8' : 'border bg-card py-4',
      )}
    >
      <span className={cn('font-bold tabular', current ? 'text-jumbo' : 'text-ticket')}>
        {ticket.number}
      </span>
      <ArrowRight className={current ? 'size-12' : 'size-8'} aria-label="to" />
      <span className={cn('font-bold', current ? 'text-jumbo' : 'text-ticket')}>{ticket.bay}</span>
      <span
        className={cn(
          'hidden text-right sm:block',
          current ? 'text-2xl' : 'text-lg text-muted-foreground',
        )}
      >
        {ticket.service}
      </span>
    </div>
  );
}
