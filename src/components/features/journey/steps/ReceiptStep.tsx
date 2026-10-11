'use client';

import { useTranslations } from 'next-intl';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DefinitionList } from '@/components/common/DefinitionList';
import { NextStepCallout } from '@/components/common/NextStepCallout';
import type { JourneyStep } from '@/types/journey';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

export default function ReceiptStep({ step, data }: StepProps) {
  const t = useTranslations('journey');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep(step);

  const content = {
    'payment-confirmed': {
      title: t('paymentConfirmed.title'),
      body: t('paymentConfirmed.body'),
      slip: data.receipt?.number,
      rows: data.receipt?.rows,
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
  } as Partial<
    Record<
      JourneyStep,
      { title: string; body: string; slip?: string; rows?: { label: string; value: string }[] }
    >
  >;
  const view = content[step];
  if (!view) return null;

  return (
    <div className="grid gap-6">
      <StepHeading title={view.title} body={view.body} done />
      <Card className="grid gap-4 p-5 sm:max-w-2xl">
        {view.slip && <p className="text-ticket font-bold text-primary tabular">{view.slip}</p>}
        {view.rows && <DefinitionList rows={view.rows} />}
      </Card>
      {step === 'submitted' && (
        <NextStepCallout
          eyebrow={common('whatNext')}
          title={t('submitted.nextTitle')}
          detail={t('submitted.nextBody')}
        />
      )}
      <StepActions>
        <Button size="lg" variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden /> {common('print')}
        </Button>
        {step !== 'submitted' && (
          <Button size="lg" loading={pending} onClick={() => advance('acknowledge')}>
            {common('continue')}
          </Button>
        )}
      </StepActions>
    </div>
  );
}
