'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SignaturePad } from '@/components/common/SignaturePad';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

export default function ConsentStep({ data, client }: StepProps) {
  const t = useTranslations('journey.consent');
  const { advance, pending } = useJourneyStep('consent');
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [clearSignal, setClearSignal] = useState(0);

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body')} />
      <Card className="grid gap-4 p-5">
        <p>{data.consentText}</p>
        <label className="flex items-center gap-3 rounded-field border-2 border-primary/40 bg-primary-tint/40 p-4 font-medium has-[[data-state=checked]]:border-primary">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="size-5"
          />
          {t('agree')}
        </label>
      </Card>
      <Card className="p-5">
        <SignaturePad
          key={clearSignal}
          label={t('signature')}
          signerName={client.name}
          hint={t('signHint')}
          onChange={setSignature}
        />
      </Card>
      <StepActions>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setClearSignal((value) => value + 1);
            setSignature(null);
          }}
        >
          {t('clear')}
        </Button>
        <Button
          size="lg"
          disabled={!agreed || !signature}
          loading={pending}
          onClick={() => advance('sign-consent', { signature })}
        >
          {t('sign')}
        </Button>
      </StepActions>
    </div>
  );
}
