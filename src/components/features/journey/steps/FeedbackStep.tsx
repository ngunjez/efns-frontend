'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/common/FormField';
import { cn } from '@/lib/utils';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

export default function FeedbackStep(_: StepProps) {
  const t = useTranslations('journey.feedback');
  const send = useCustomerAction();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (send.isSuccess) return <StepHeading title={t('thanks')} done />;

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body')} />
      <Card className="grid gap-6 p-5 sm:max-w-2xl">
        <fieldset className="grid gap-3">
          <legend className="mb-2 font-semibold">{t('rating')}</legend>
          <RadioGroupPrimitive.Root
            orientation="horizontal"
            value={String(rating)}
            onValueChange={(value) => setRating(Number(value))}
            className="flex gap-2"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <RadioGroupPrimitive.Item
                key={value}
                value={String(value)}
                aria-label={t('stars', { count: value })}
                className="rounded-control p-1"
              >
                <Star
                  className={cn(
                    'size-10 sm:size-12',
                    value <= rating ? 'fill-warning text-warning' : 'text-input',
                  )}
                  aria-hidden
                />
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroupPrimitive.Root>
        </fieldset>
        <FormField label={t('comment')}>
          {(control) => (
            <Textarea
              {...control}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          )}
        </FormField>
      </Card>
      <StepActions>
        <Button
          size="lg"
          disabled={!rating}
          loading={send.isPending}
          onClick={() =>
            send.mutate({ step: 'feedback', action: 'rate', payload: { rating, comment } })
          }
        >
          {t('send')}
        </Button>
      </StepActions>
    </div>
  );
}
