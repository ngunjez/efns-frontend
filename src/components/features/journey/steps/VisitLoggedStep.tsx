'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckItem } from '@/components/common/CheckItem';
import { ChoiceCards } from '@/components/common/ChoiceCards';
import { NextStepCallout } from '@/components/common/NextStepCallout';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

export default function VisitLoggedStep({ data, client }: StepProps) {
  const t = useTranslations('journey.visitLogged');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('visit-logged');
  const pass = data.visitPass;
  const [queue, setQueue] = useState(pass?.queues[0]?.key);
  if (!pass) return null;

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} done />
      <div className="grid gap-5 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <p className="bg-primary px-5 py-2 text-xs font-semibold tracking-wide text-primary-foreground uppercase">
            {t('pass')}
          </p>
          <div className="grid justify-items-center gap-2 p-6 text-center">
            <Avatar name={client.name} className="size-16 text-xl" />
            <span className="text-lg font-semibold">{client.name}</span>
            <span className="text-sm text-muted-foreground">{pass.service}</span>
            <span className="text-ticket font-bold tabular">{pass.number}</span>
            <span className="text-xs text-muted-foreground">{pass.time}</span>
          </div>
        </Card>
        <div className="grid content-start gap-5">
          <Card className="p-5">
            <h2 className="mb-2 font-semibold">{t('atEntrance')}</h2>
            <ul className="divide-y">
              {pass.checks.map((check) => (
                <CheckItem key={check} label={check} />
              ))}
            </ul>
          </Card>
          <NextStepCallout
            eyebrow={common('whatNext')}
            title={t('nextTitle')}
            detail={t('nextBody')}
          />
        </div>
      </div>
      <Card className="grid gap-4 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-h3">{t('whichQueue')}</h2>
          <span className="text-sm text-muted-foreground">{t('queueHint')}</span>
        </div>
        <ChoiceCards
          label={t('whichQueue')}
          columns={4}
          indicator={false}
          value={queue}
          onValueChange={setQueue}
          choices={pass.queues.map((item) => ({
            value: item.key,
            label: item.label,
            hint: item.hint,
          }))}
        />
      </Card>
      <StepActions>
        <Button
          size="lg"
          disabled={!queue}
          loading={pending}
          onClick={() => advance('choose-queue', { queue })}
        >
          {t('goToReception')}
        </Button>
      </StepActions>
    </div>
  );
}
