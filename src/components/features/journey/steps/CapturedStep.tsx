'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckItem } from '@/components/common/CheckItem';
import { DefinitionList } from '@/components/common/DefinitionList';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

export default function CapturedStep({ data, client }: StepProps) {
  const t = useTranslations('journey.captured');
  const { advance, pending } = useJourneyStep('documents-captured');
  const passport = data.passport;

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body', { reference: client.reference })} />
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {passport && (
          <Card className="grid gap-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{t('passport')}</h2>
              <Badge tone="success">{t('machineCheck')}</Badge>
            </div>
            <pre
              className="overflow-x-auto rounded-control border-2 border-success bg-muted p-3 font-mono text-xs leading-relaxed"
              aria-label="Machine-readable zone"
            >
              {passport.mrz.join('\n')}
            </pre>
            <DefinitionList dense rows={passport.rows} />
          </Card>
        )}
        <Card className="grid gap-3 p-5">
          <h2 className="text-lg font-semibold">{t('documents')}</h2>
          <ul className="divide-y">
            {(data.documents ?? []).map((document) => (
              <CheckItem
                key={document.label}
                label={document.label}
                trailing={<StatusBadge status={document.status} />}
              />
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">{t('originalsNote')}</p>
        </Card>
      </div>
      <StepActions>
        <Button size="lg" loading={pending} onClick={() => advance('originals-returned')}>
          {t('confirm')}
        </Button>
      </StepActions>
    </div>
  );
}
