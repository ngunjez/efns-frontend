'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import type { TimeSlot } from '@/types/domain';

export function TimeSlotPicker({
  slots,
  value,
  onValueChange,
  label,
  fullLabel,
}: {
  slots: TimeSlot[];
  value: string | undefined;
  onValueChange: (time: string) => void;
  label: string;
  fullLabel: (time: string) => string;
}) {
  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2"
    >
      {slots.map((slot) => (
        <RadioGroupPrimitive.Item
          key={slot.time}
          value={slot.time}
          disabled={!slot.available}
          aria-label={slot.available ? slot.time : fullLabel(slot.time)}
          className="h-11 rounded-control border bg-card text-sm font-semibold tabular transition-colors hover:border-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:line-through disabled:hover:border-border data-[state=checked]:border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary-tint data-[state=checked]:text-primary"
        >
          {slot.time}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
