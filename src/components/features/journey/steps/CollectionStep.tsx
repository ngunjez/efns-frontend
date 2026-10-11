'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckItem } from '@/components/common/CheckItem';
import { DefinitionList } from '@/components/common/DefinitionList';
import { SignaturePad } from '@/components/common/SignaturePad';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

/** Frame 42: identity confirmed, passport released by two officers, the client signs for it. */
export default function CollectionStep({ data, client }: StepProps) {
  const t = useTranslations('journey.collection');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('collection');
  const flag = useCustomerAction();
  const [signature, setSignature] = useState<string | null>(null);
  const collection = data.collection;
  if (!collection) return null;

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body')} />
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="grid gap-3 p-5">
          <h2 className="text-lg font-semibold">{t('checked')}</h2>
          <ul className="divide-y">
            {collection.checks.map((check) => (
              <CheckItem key={check} label={check} />
            ))}
          </ul>
          <DefinitionList dense rows={collection.rows} />
        </Card>
        <Card className="grid gap-3 p-5">
          <SignaturePad
            label={t('sign')}
            signerName={client.name}
            hint={t('sign')}
            onChange={setSignature}
          />
          <p className="text-sm text-muted-foreground">{t('signNote')}</p>
        </Card>
      </div>
      <StepActions>
        <Button
          size="lg"
          variant="outline"
          onClick={() => flag.mutate({ step: 'collection', action: 'report-problem' })}
        >
          {common('somethingWrong')}
        </Button>
        <Button
          size="lg"
          disabled={!signature}
          loading={pending}
          onClick={() => advance('confirm-collection', { signature })}
        >
          {t('received')}
        </Button>
      </StepActions>
    </div>
  );
}
