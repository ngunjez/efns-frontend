'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Large selectable cards backed by a radio group (keyboard and screen-reader
 * correct): account category, queue choice, payment method.
 */
export function ChoiceCards({
  choices,
  value,
  onValueChange,
  label,
  columns = 1,
  indicator = true,
  className,
}: {
  choices: Choice[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  label: string;
  columns?: 1 | 2 | 3 | 4;
  indicator?: boolean;
  className?: string;
}) {
  const grid = {
    1: '',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];
  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className={cn('grid gap-3', grid, className)}
    >
      {choices.map((choice) => (
        <RadioGroupPrimitive.Item
          key={choice.value}
          value={choice.value}
          className="group flex items-center gap-4 rounded-field border bg-card p-4 text-left transition-colors hover:border-primary/50 data-[state=checked]:border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary-tint"
        >
          {indicator && (
            <span
              aria-hidden
              className="grid size-5 shrink-0 place-items-center rounded-full border border-input bg-card group-data-[state=checked]:border-primary"
            >
              <span className="size-2.5 rounded-full bg-primary opacity-0 group-data-[state=checked]:opacity-100" />
            </span>
          )}
          <span className="grid gap-0.5">
            <span className="font-semibold group-data-[state=checked]:text-primary">
              {choice.label}
            </span>
            {choice.hint && <span className="text-sm text-muted-foreground">{choice.hint}</span>}
          </span>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
