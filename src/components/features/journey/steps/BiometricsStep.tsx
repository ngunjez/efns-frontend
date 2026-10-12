'use client';

import { useTranslations } from 'next-intl';
import { UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NextStepCallout } from '@/components/common/NextStepCallout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import type { FingerState } from '@/types/journey';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

const FINGER_HEIGHTS = ['h-8', 'h-12', 'h-14', 'h-12', 'h-9'];
const fingerTone: Record<FingerState, string> = {
  captured: 'bg-success',
  retake: 'bg-destructive',
  pending: 'bg-muted',
};

export default function BiometricsStep({ data }: StepProps) {
  const t = useTranslations('journey.biometrics');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('biometrics');
  const bio = data.biometrics;
  if (!bio) return null;
  const done = !bio.issue && !bio.attempts;

  return (
    <div className="grid gap-6">
      <StepHeading
        title={done ? t('doneTitle') : (bio.issue?.title ?? t('title'))}
        body={done ? t('doneBody') : (bio.issue?.detail ?? t('body'))}
      />
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_16rem]">
        <Card className="grid gap-5 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">{t('fingerprints')}</h2>
            <Badge tone={done ? 'success' : 'warning'}>{bio.captured}</Badge>
          </div>
          <div className="flex flex-wrap justify-around gap-6">
            <Hand label={t('leftHand')} fingers={bio.left} />
            <Hand label={t('rightHand')} fingers={[...bio.right].reverse()} />
          </div>
          {bio.issue && (
            <p
              role="alert"
              className="rounded-control border border-destructive bg-destructive-tint p-3 text-sm"
            >
              <strong className="block text-destructive-foreground">{bio.issue.finger}</strong>
              {t('wipeHint')}
            </p>
          )}
          {bio.lowest && (
            <p className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('lowest')}</span>
              <strong>{bio.lowest}</strong>
            </p>
          )}
        </Card>
        <Card className="grid justify-items-center gap-3 p-5 text-center">
          <h2 className="text-lg font-semibold">{t('facePhoto')}</h2>
          <div className="grid aspect-[4/5] w-full max-w-40 place-items-center rounded-control border-2 border-success bg-muted">
            <UserRound className="size-16 text-muted-foreground" aria-hidden />
          </div>
          <StatusBadge status={bio.photo} />
        </Card>
      </div>
      {done ? (
        <>
          <NextStepCallout
            eyebrow={common('whatNext')}
            title={t('nextTitle')}
            detail={t('nextBody')}
          />
          <StepActions>
            <Button size="lg" loading={pending} onClick={() => advance('biometrics-complete')}>
              {common('continue')}
            </Button>
          </StepActions>
        </>
      ) : null}
    </div>
  );
}

function Hand({ label, fingers }: { label: string; fingers: FingerState[] }) {
  const t = useTranslations('journey.biometrics');
  return (
    <figure className="grid justify-items-center gap-2">
      <div
        className="flex items-end gap-1.5"
        role="img"
        aria-label={t('handCaptured', {
          hand: label,
          count: fingers.filter((finger) => finger === 'captured').length,
        })}
      >
        {fingers.map((finger, index) => (
          <span
            key={index}
            className={cn('w-4 rounded-t-full', FINGER_HEIGHTS[index], fingerTone[finger])}
          />
        ))}
      </div>
      <span aria-hidden className="h-6 w-24 rounded-b-3xl bg-muted" />
      <figcaption className="text-sm font-medium">{label}</figcaption>
    </figure>
  );
}
