'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DefinitionList } from '@/components/common/DefinitionList';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

export default function CheckDetailsStep({ data, officer }: StepProps) {
  const t = useTranslations('journey.checkDetails');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('check-details');
  const flag = useCustomerAction();
  const sections = data.details ?? [];

  const askToChange = (section: string) =>
    flag.mutate({ step: 'check-details', action: 'ask-to-change', payload: { section } });

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body', { officer })} />
      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="grid content-start gap-2 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <Button variant="link" size="sm" onClick={() => askToChange(section.title)}>
                {t('askToChange')}
                <span className="sr-only">: {section.title}</span>
              </Button>
            </div>
            <DefinitionList dense rows={section.rows} />
          </Card>
        ))}
      </div>
      <StepActions>
        <Button size="lg" variant="outline" onClick={() => askToChange('general')}>
          {common('somethingWrong')}
        </Button>
        <Button size="lg" loading={pending} onClick={() => advance('confirm-details')}>
          {t('correct')}
        </Button>
      </StepActions>
    </div>
  );
}
