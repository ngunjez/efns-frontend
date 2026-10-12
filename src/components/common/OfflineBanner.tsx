'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useOnline } from '@/hooks/use-online';
import { useIntlLocale } from '@/hooks/use-intl-locale';
import { formatTime } from '@/lib/format';
import type { OfflineState } from '@/types/journey';

export interface OfflineCopy {
  title: string;
  detail: (since: string) => string;
  waiting: (count: number) => string;
  deviceOffline: string;
}

const staffCopy: OfflineCopy = {
  title: 'Operating in store and forward mode.',
  detail: (since) =>
    `The government systems have been unreachable since ${since}. Work is saved on this counter and sends itself when the link returns.`,
  waiting: (count) => `${count} item${count === 1 ? '' : 's'} waiting to sync`,
  deviceOffline: 'This device is offline. Changes are kept and sent when the connection returns.',
};

export function OfflineBanner({
  offline,
  copy = staffCopy,
}: {
  offline?: OfflineState | null;
  copy?: OfflineCopy;
}) {
  const online = useOnline();
  const intl = useIntlLocale();
  const visible = Boolean(offline) || !online;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <m.div
          role="status"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-card bg-warning-tint px-4 py-3 text-sm">
            <span aria-hidden className="size-2 shrink-0 animate-pulse rounded-full bg-warning" />
            <span className="flex-1">
              <strong>{copy.title}</strong>{' '}
              {offline ? copy.detail(formatTime(offline.since, intl)) : copy.deviceOffline}
            </span>
            {offline && (
              <strong className="whitespace-nowrap">{copy.waiting(offline.pending.length)}</strong>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
