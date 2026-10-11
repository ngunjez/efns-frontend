'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';

const STREAMS = [
  { key: 'general', letter: 'G' },
  { key: 'priority', letter: 'P' },
  { key: 'executive', letter: 'VIP' },
] as const;
const REASONS = ['reasonSenior', 'reasonDisability', 'reasonExpectant', 'reasonInfant'] as const;

/** Frames 10 and 13: the floor host chooses the client's stream and any language or voice help. */
export default function WelcomeStep(_: StepProps) {
  const t = useTranslations('journey.welcome');
  const { advance, pending } = useJourneyStep('welcome');
  const [stream, setStream] = useState<(typeof STREAMS)[number]['key'] | null>(null);
  const [reason, setReason] = useState<(typeof REASONS)[number]>('reasonSenior');
  const [voice, setVoice] = useState(false);

  const choose = (key: (typeof STREAMS)[number]['key']) => {
    setStream(key);
    advance('choose-stream', {
      stream: key,
      reason: key === 'priority' ? reason : undefined,
      voice,
    });
  };

  const copy = {
    general: { title: t('general'), body: t('generalBody'), cta: t('chooseGeneral') },
    priority: { title: t('priority'), body: t('priorityBody'), cta: t('printPriority') },
    executive: { title: t('executive'), body: t('executiveBody'), cta: t('chooseExecutive') },
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-2 text-center">
        <h1 className="text-display">{t('title')}</h1>
        <p className="text-lead text-muted-foreground">{t('body')}</p>
      </div>

      <ul className="grid gap-5 md:grid-cols-3">
        {STREAMS.map(({ key, letter }) => {
          const selected = stream === key;
          return (
            <li key={key}>
              <Card
                className={cn(
                  'flex h-full flex-col gap-4 p-6 transition-colors',
                  selected && 'border-2 border-primary',
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-full bg-primary-tint text-sm font-bold text-primary"
                  >
                    {letter}
                  </span>
                  {selected && <Badge tone="info">{t('selected')}</Badge>}
                </div>
                <h2 className="text-h3">{copy[key].title}</h2>
                <p className="text-muted-foreground">{copy[key].body}</p>
                {key === 'priority' && (
                  <fieldset className="grid gap-2">
                    <legend className="sr-only">{t('priority')}</legend>
                    {REASONS.map((item) => (
                      <label
                        key={item}
                        className={cn(
                          'cursor-pointer rounded-control border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-tint has-[:checked]:font-semibold has-[:checked]:text-primary',
                        )}
                      >
                        <input
                          type="radio"
                          name="priority-reason"
                          value={item}
                          checked={reason === item}
                          onChange={() => setReason(item)}
                          className="sr-only"
                        />
                        {t(item)}
                      </label>
                    ))}
                  </fieldset>
                )}
                <Button
                  size="lg"
                  variant={key === 'priority' ? 'default' : 'outline'}
                  className="mt-auto"
                  loading={pending && selected}
                  onClick={() => choose(key)}
                >
                  {copy[key].cta}
                </Button>
              </Card>
            </li>
          );
        })}
      </ul>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-4 text-sm">
        <p>
          <strong>{t('bookedClient')}</strong> {t('bookedHint')}
        </p>
        <label className="flex items-center gap-3">
          <span className="font-medium">{t('voice')}</span>
          <Switch checked={voice} onCheckedChange={setVoice} />
        </label>
        <p className="text-muted-foreground">{t('tapHint')}</p>
      </Card>
    </div>
  );
}
