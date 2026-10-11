'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserRound } from 'lucide-react';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/common/FormField';
import { NextStepCallout } from '@/components/common/NextStepCallout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import type { FingerState, JourneyData } from '@/types/journey';
import { useJourneyStep } from '../use-journey-step';
import type { StepProps } from '../CustomerScreen';
import { StepActions, StepHeading } from '../StepParts';

const FINGER_HEIGHTS = ['h-8', 'h-12', 'h-14', 'h-12', 'h-9'];
const fingerTone: Record<FingerState, string> = {
  captured: 'bg-success',
  retake: 'bg-destructive',
  pending: 'bg-muted',
};

/** Frames 29–31: photo and fingerprints, a guided retake, and the manager override at the retake limit. */
export default function BiometricsStep({ data }: StepProps) {
  const t = useTranslations('journey.biometrics');
  const common = useTranslations('common');
  const { advance, pending } = useJourneyStep('biometrics');
  const retake = useCustomerAction();
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
      ) : (
        <StepActions>
          <Button
            size="lg"
            loading={retake.isPending}
            onClick={() => retake.mutate({ step: 'biometrics', action: 'retake' })}
          >
            {t('retake')}
          </Button>
        </StepActions>
      )}
      {bio.attempts && <OverrideDialog bio={bio} />}
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

/** Frame 30 (officer screen): after three failed retakes a Hub Manager authorises how to continue. */
function OverrideDialog({ bio }: { bio: NonNullable<JourneyData['biometrics']> }) {
  const { advance, pending } = useJourneyStep('biometrics');
  const [reason, setReason] = useState<string>();
  const [route, setRoute] = useState<string>();
  const [pin, setPin] = useState('');
  const [note, setNote] = useState('');

  return (
    <Dialog open>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Retake limit reached</DialogTitle>
          <DialogDescription>
            The finger failed {bio.attempts?.length} times. A Hub Manager must decide how to
            continue.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid grid-cols-3 gap-2">
          {bio.attempts?.map((score, index) => (
            <li
              key={index}
              className="grid rounded-control border border-destructive bg-destructive-tint p-3"
            >
              <span className="text-xs text-muted-foreground">Attempt {index + 1}</span>
              <span className="text-xl font-bold text-destructive-foreground tabular">{score}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Likely reason" required>
            {(control) => (
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger {...control}>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {['Worn fingerprints', 'Injury or bandage', 'Device fault'].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField label="How to continue" required>
            {(control) => (
              <Select value={route} onValueChange={setRoute}>
                <SelectTrigger {...control}>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'Accept 9 fingers and the face photo',
                    'Book a return visit',
                    'Escalate to the authority',
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </div>
        <div className="grid gap-3 rounded-field border-2 border-primary p-4">
          <div className="flex items-center gap-3">
            <Avatar name={bio.manager.name} className="size-8 text-xs" />
            <span className="grid flex-1 leading-tight">
              <span className="text-sm font-semibold">{bio.manager.name}</span>
              <span className="text-xs text-muted-foreground">{bio.manager.role}</span>
            </span>
            <Badge tone="warning">Authorisation needed</Badge>
          </div>
          <FormField
            label="Manager PIN"
            required
            help="Six digits, entered by the manager. Or the manager's fingerprint on the reader."
          >
            {(control) => (
              <Input
                {...control}
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))}
              />
            )}
          </FormField>
        </div>
        <FormField label="Reason for the override" required>
          {(control) => (
            <Textarea {...control} value={note} onChange={(event) => setNote(event.target.value)} />
          )}
        </FormField>
        <p className="text-xs text-muted-foreground">
          The override, the three scores and the manager are recorded on the application and sent
          with it to the authority.
        </p>
        <DialogFooter>
          <Button
            disabled={!reason || !route || pin.length !== 6 || !note.trim()}
            loading={pending}
            onClick={() => advance('approve-override', { reason, route, pin, note })}
          >
            Approve override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
