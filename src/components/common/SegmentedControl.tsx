'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export function SegmentedControl({
  options,
  value,
  onValueChange,
  label,
  size = 'md',
  className,
}: {
  options: { value: string; label: string; disabled?: boolean }[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      orientation="horizontal"
      value={value}
      onValueChange={onValueChange}
      className={cn('inline-flex flex-wrap gap-2', className)}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            'rounded-control border bg-card font-semibold transition-colors hover:bg-muted disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary-tint data-[state=checked]:text-primary',
            size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-[0.9375rem]',
          )}
        >
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
