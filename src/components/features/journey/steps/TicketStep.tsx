'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import type { StepProps } from '../CustomerScreen';
import { StepHeading } from '../StepParts';

/** Frames 17–18: the queue ticket, and waiting to be called. Nothing for the client to do. */
export default function TicketStep({ data }: StepProps) {
  const t = useTranslations('journey.ticket');
  const ticket = data.ticket;
  if (!ticket) return null;

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body')} />
      <Card className="grid justify-items-center gap-3 p-8 text-center sm:p-12">
        <span className="text-sm text-muted-foreground">{ticket.queue}</span>
        <span className="text-jumbo font-bold text-primary tabular" aria-live="polite">
          {ticket.number}
        </span>
        <span className="text-lead font-semibold">{t('ahead', { count: ticket.ahead })}</span>
        <span className="text-muted-foreground">{t('estimate', { time: ticket.estimate })}</span>
        {ticket.sms && <span className="text-sm text-muted-foreground">{t('sms')}</span>}
      </Card>
    </div>
  );
}
