'use client';

import { useState } from 'react';
import { useCaseCommand } from '@/api/hooks/use-desk';
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
import { ChoiceCards } from '@/components/common/ChoiceCards';
import { FormField } from '@/components/common/FormField';

const PROBLEMS = [
  { value: 'damaged', label: 'Torn or damaged', hint: 'A page, the cover or the chip' },
  { value: 'expired', label: 'Expired', hint: 'Or under 6 months left' },
  { value: 'machine-check', label: 'Machine check failed', hint: 'MRZ checksum error' },
  { value: 'mismatch', label: 'Details do not match', hint: 'Against the application' },
];

const OUTCOMES = [
  'Continue, client told and signs',
  'Hold the case until a new document',
  'Return to the client, case closed',
];

export function DocumentProblemDialog({
  open,
  onOpenChange,
  documents,
  officer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: string[];
  officer: string;
}) {
  const command = useCaseCommand();
  const [problem, setProblem] = useState<string>();
  const [document, setDocument] = useState(documents[0]);
  const [where, setWhere] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File>();
  const [outcome, setOutcome] = useState(OUTCOMES[0]);

  const submit = () =>
    command.mutate(
      {
        name: 'document-problem',
        payload: { problem, document, where, description, outcome, photo: photo?.name },
      },
      { onSuccess: () => onOpenChange(false) },
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Flag a passport or document problem</DialogTitle>
          <DialogDescription>
            Record the defect before the passport goes to the vault, so the hub is not held
            responsible for it later.
          </DialogDescription>
        </DialogHeader>
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-semibold">What is wrong?</legend>
          <ChoiceCards
            label="What is wrong?"
            columns={4}
            indicator={false}
            choices={PROBLEMS}
            value={problem}
            onValueChange={setProblem}
          />
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Document" required>
            {(control) => (
              <Select value={document} onValueChange={setDocument}>
                <SelectTrigger {...control}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField label="Where">
            {(control) => (
              <Input
                {...control}
                value={where}
                onChange={(event) => setWhere(event.target.value)}
              />
            )}
          </FormField>
          <FormField label="Describe what you see" required className="sm:col-span-2">
            {(control) => (
              <Textarea
                {...control}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            )}
          </FormField>
          <FormField label="Photo of the defect">
            {(control) => (
              <Input
                {...control}
                type="file"
                accept="image/*"
                capture="environment"
                className="h-auto py-2.5"
                onChange={(event) => setPhoto(event.target.files?.[0])}
              />
            )}
          </FormField>
          <FormField label="What happens to the application" required>
            {(control) => (
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger {...control}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTCOMES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </div>
        <p className="text-xs text-muted-foreground">
          Recorded by {officer}. The client sees this note and signs it on the pad. It is printed on
          the lodgement receipt.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!problem || !document || !description.trim()}
            loading={command.isPending}
            onClick={submit}
          >
            Record exception
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
