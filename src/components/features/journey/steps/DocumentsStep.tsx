'use client';

import { useTranslations } from 'next-intl';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckItem } from '@/components/common/CheckItem';
import { NextStepCallout } from '@/components/common/NextStepCallout';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

/** Frames 15, 14, 16: the reception document check, read in the client's language. */
export default function DocumentsStep({ data }: StepProps) {
  const t = useTranslations('journey.documents');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('documents');
  const checklist = data.checklist ?? [];
  const missing = data.missing;

  return (
    <div className="grid gap-6">
      <StepHeading
        title={missing ? t('missingTitle') : t('completeTitle')}
        body={missing ? t('missingBody') : t('completeBody')}
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {checklist.map((item) => (
          <CheckItem
            key={item.label}
            boxed
            label={item.label}
            state={item.done ? 'done' : 'failed'}
            trailing={
              <span
                className={
                  item.done
                    ? 'text-sm font-semibold text-success-foreground'
                    : 'text-sm font-semibold text-destructive-foreground'
                }
              >
                {item.done ? t('checked') : t('missing')}
              </span>
            }
          />
        ))}
      </ul>
      {missing ? (
        <>
          <NextStepCallout
            eyebrow={common('whatNext')}
            title={missing.title}
            detail={missing.detail}
          />
          <StepActions>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              <Printer aria-hidden /> {t('printChecklist')}
            </Button>
          </StepActions>
        </>
      ) : (
        <>
          <NextStepCallout
            eyebrow={common('whatNext')}
            title={t('nextTitle')}
            detail={t('nextBody')}
          />
          <StepActions>
            <Button size="lg" loading={pending} onClick={() => advance('issue-ticket')}>
              {t('getTicket')}
            </Button>
          </StepActions>
        </>
      )}
    </div>
  );
}
