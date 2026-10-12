'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Printer } from 'lucide-react';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DefinitionList } from '@/components/common/DefinitionList';
import { NextStepCallout } from '@/components/common/NextStepCallout';
import { SignaturePad } from '@/components/common/SignaturePad';
import type { JourneyStep } from '@/types/journey';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

type ReceiptStepKey = Extract<
  JourneyStep,
  'payment-confirmed' | 'provisional-slip' | 'lodgement' | 'submitted'
>;

export default function ReceiptStep({ step, data, client, offline }: StepProps) {
  const t = useTranslations('journey');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep(step);
  const send = useCustomerAction();
  const [signature, setSignature] = useState<string | null>(null);

  const content: Record<
    ReceiptStepKey,
    { title: string; body: string; slip?: string; rows?: { label: string; value: string }[] }
  > = {
    'payment-confirmed': {
      title: t('paymentConfirmed.title'),
      body: t('paymentConfirmed.body'),
      slip: data.receipt?.number,
      rows: data.receipt?.rows,
    },
    'provisional-slip': {
      title: t('provisional.title'),
      body: t('provisional.body'),
      slip: data.provisional?.number,
      rows: data.provisional?.rows,
    },
    lodgement: {
      title: t('lodgement.title'),
      body: t('lodgement.body'),
      slip: data.lodgement?.receipt,
      rows: data.lodgement?.rows,
    },
    submitted: {
      title: t('submitted.title'),
      body: t('submitted.body'),
      slip: data.acknowledgement?.reference,
      rows: data.acknowledgement?.rows,
    },
  };
  const view = content[step as ReceiptStepKey];
  if (!view) return null;

  const provisional = step === 'provisional-slip';
  const lodgement = step === 'lodgement';
  const canContinue = step !== 'submitted' && (!lodgement || Boolean(signature));

  return (
    <div className="grid gap-6">
      <StepHeading title={view.title} body={view.body} done={!provisional} />
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="grid gap-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {view.slip && <p className="text-ticket font-bold text-primary tabular">{view.slip}</p>}
            {provisional && <Badge tone="warning">{t('provisional.notConfirmed')}</Badge>}
            {lodgement && <Badge tone="success">{t('lodgement.inVault')}</Badge>}
          </div>
          {view.rows && <DefinitionList rows={view.rows} />}
        </Card>
        {provisional && offline && (
          <Card className="grid gap-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{t('provisional.waitingToSync')}</h2>
              <Badge tone="warning">{offline.pending.length}</Badge>
            </div>
            <ul className="divide-y">
              {offline.pending.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <span className="grid">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {t('provisional.savedAt', { time: item.savedAt })}
                    </span>
                  </span>
                  <Badge tone="warning">{t('provisional.waiting')}</Badge>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">{t('provisional.syncNote')}</p>
          </Card>
        )}
        {lodgement && (
          <div className="grid gap-4">
            <Card className="p-5">
              <SignaturePad
                label={t('lodgement.sign')}
                signerName={client.name}
                hint={t('consent.signHint')}
                onChange={setSignature}
              />
            </Card>
            <p className="rounded-card bg-warning-tint p-4 text-sm">
              <strong>{t('lodgement.keepTitle')}</strong> {t('lodgement.keepBody')}
            </p>
          </div>
        )}
      </div>
      {step === 'submitted' && (
        <NextStepCallout
          eyebrow={common('whatNext')}
          title={t('submitted.nextTitle')}
          detail={t('submitted.nextBody')}
        />
      )}
      <StepActions>
        {(provisional || lodgement) && (
          <Button
            size="lg"
            variant="outline"
            loading={send.isPending}
            onClick={() => send.mutate({ step, action: 'send-receipt' })}
          >
            <Mail aria-hidden /> {lodgement ? t('lodgement.sendToPhone') : t('provisional.email')}
          </Button>
        )}
        <Button size="lg" variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden /> {common('print')}
        </Button>
        {step !== 'submitted' && (
          <Button
            size="lg"
            disabled={!canContinue}
            loading={pending}
            onClick={() => advance('acknowledge', signature ? { signature } : undefined)}
          >
            {common('continue')}
          </Button>
        )}
      </StepActions>
    </div>
  );
}
