'use client';

import { useState } from 'react';
import { useCaseCommand } from '@/api/hooks/use-desk';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import type { JourneyData } from '@/types/journey';

const REASONS = ['Worn fingerprints', 'Injury or bandage', 'Device fault'];
const ROUTES = [
  'Accept 9 fingers and the face photo',
  'Book a return visit',
  'Escalate to the authority',
];

export function OverrideDialog({
  open,
  onOpenChange,
  biometrics,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  biometrics: NonNullable<JourneyData['biometrics']>;
}) {
  const command = useCaseCommand();
  const [reason, setReason] = useState<string>();
  const [route, setRoute] = useState<string>();
  const [pin, setPin] = useState('');
  const [note, setNote] = useState('');
  const attempts = biometrics.attempts ?? [];

  const choose = (
    label: string,
    value: string | undefined,
    onChange: (value: string) => void,
    items: string[],
  ) => (
    <FormField label={label} required>
      {(control) => (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger {...control}>
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Retake limit reached</DialogTitle>
          <DialogDescription>
            The finger failed {attempts.length} times and needs a quality of 60 or more. A Hub
            Manager must decide how to continue.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid grid-cols-3 gap-2">
          {attempts.map((score, index) => (
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
          {choose('Likely reason', reason, setReason, REASONS)}
          {choose('How to continue', route, setRoute, ROUTES)}
        </div>
        <div className="grid gap-3 rounded-field border-2 border-primary p-4">
          <div className="flex items-center gap-3">
            <Avatar name={biometrics.manager.name} className="size-8 text-xs" />
            <span className="grid flex-1 leading-tight">
              <span className="text-sm font-semibold">{biometrics.manager.name}</span>
              <span className="text-xs text-muted-foreground">{biometrics.manager.role}</span>
            </span>
            <Badge tone="warning">Authorisation needed</Badge>
          </div>
          <FormField
            label="Manager PIN"
            required
            help="Six digits, entered by the manager, or the manager's fingerprint on the reader."
          >
            {(control) => (
              <Input
                {...control}
                type="password"
                inputMode="numeric"
                autoComplete="off"
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
          The override, the scores and the manager are recorded on the application and sent with it
          to the authority.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!reason || !route || pin.length !== 6 || !note.trim()}
            loading={command.isPending}
            onClick={() =>
              command.mutate(
                { name: 'approve-override', payload: { reason, route, pin, note } },
                { onSuccess: () => onOpenChange(false) },
              )
            }
          >
            Approve override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
