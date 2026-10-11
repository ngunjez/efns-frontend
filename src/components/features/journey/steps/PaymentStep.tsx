'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChoiceCards } from '@/components/common/ChoiceCards';
import { FormField } from '@/components/common/FormField';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

const STATES = ['awaiting', 'verifying', 'confirmed'] as const;

export default function PaymentStep({ data, client }: StepProps) {
  const t = useTranslations('journey.payment');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('payment');
  const action = useCustomerAction();
  const invoice = data.invoice;
  const [method, setMethod] = useState(invoice?.methods[0]?.key);
  const [phone, setPhone] = useState(invoice?.phone ?? '');
  const [reference, setReference] = useState('');
  if (!invoice) return null;

  const amount = formatMoney(invoice.total);
  const current = STATES.indexOf(invoice.state);
  const request = (payload: Record<string, unknown>) =>
    action.mutate({ step: 'payment', action: 'request-payment', payload: { method, ...payload } });

  return (
    <div className="grid gap-6">
      <StepHeading title={t('title')} body={t('body')} />

      <Card className="grid items-center gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="grid gap-2">
          <span className="text-xs text-muted-foreground">
            {t('invoiceFor', { reference: client.reference })}
          </span>
          <h2 className="text-h3">{invoice.service}</h2>
          <p className="flex justify-between gap-4 border-t pt-3 text-sm">
            <span>{t('feeLine')}</span>
            <strong className="tabular">{amount}</strong>
          </p>
          <p className="text-xs text-muted-foreground">{t('feeNote')}</p>
          <Badge tone="danger" className="justify-self-start">
            {t('noCash')}
          </Badge>
        </div>
        <div className="grid gap-1 rounded-card bg-primary-tint p-5">
          <span className="text-sm text-muted-foreground">{t('totalDue')}</span>
          <span className="text-h1 tabular">{amount}</span>
          <span className="text-sm text-muted-foreground">{t('oneReceipt')}</span>
        </div>
      </Card>

      <ChoiceCards
        label={t('title')}
        columns={4}
        indicator={false}
        value={method}
        onValueChange={setMethod}
        choices={invoice.methods.map((item) => ({
          value: item.key,
          label: item.label,
          hint: item.hint,
        }))}
      />

      <Card className="grid items-end gap-4 p-5 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto]">
        {method === 'paybill' ? (
          <FormField label={t('paybillCode')} required>
            {(control) => (
              <Input
                {...control}
                value={reference}
                onChange={(event) => setReference(event.target.value.toUpperCase())}
              />
            )}
          </FormField>
        ) : (
          <FormField label={t('phone')}>
            {(control) => (
              <Input
                {...control}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            )}
          </FormField>
        )}
        <p className="rounded-control bg-primary-tint p-3 text-sm" aria-live="polite">
          <strong>{t('checkPhone', { amount })}</strong>
        </p>
        <Button
          size="lg"
          variant="outline"
          loading={action.isPending}
          onClick={() => request(method === 'paybill' ? { reference } : { phone })}
        >
          {t('sendAgain')}
        </Button>
      </Card>

      <Card className="p-5">
        <ol className="flex flex-wrap items-center gap-x-4 gap-y-3" aria-label={t('title')}>
          {STATES.map((state, index) => (
            <li
              key={state}
              aria-current={index === current ? 'step' : undefined}
              className="flex flex-1 items-center gap-3"
            >
              {index < current || invoice.state === 'confirmed' ? (
                <CheckCircle2 className="size-6 shrink-0 fill-success text-white" aria-hidden />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    'size-6 shrink-0 rounded-full',
                    index === current ? 'border-[3px] border-primary' : 'bg-muted',
                  )}
                />
              )}
              <span
                className={cn(
                  'text-sm whitespace-nowrap',
                  index === current ? 'font-semibold' : 'text-muted-foreground',
                )}
              >
                {t(state)}
              </span>
              {index < STATES.length - 1 && (
                <span aria-hidden className="hidden h-px flex-1 bg-border sm:block" />
              )}
            </li>
          ))}
        </ol>
      </Card>

      <p className="text-sm text-muted-foreground">{t('footnote')}</p>
      {invoice.state === 'confirmed' && (
        <StepActions>
          <Button size="lg" loading={pending} onClick={() => advance('payment-acknowledged')}>
            {common('continue')}
          </Button>
        </StepActions>
      )}
    </div>
  );
}
