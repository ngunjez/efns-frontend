'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * One box per digit (frame 80): typing advances, Backspace goes back and a
 * pasted code fills every box. Used for the staff authenticator and client SMS codes.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  label,
  invalid,
  focusOnMount,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label: string;
  invalid?: boolean;
  focusOnMount?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  // Single-purpose code screens move focus to the first box when they open.
  useEffect(() => {
    if (focusOnMount) refs.current[0]?.focus();
  }, [focusOnMount]);

  const setAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  return (
    <div role="group" aria-label={label} className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          aria-label={`${label}, digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          className={cn(
            'size-12 min-w-0 flex-1 rounded-field border border-input bg-card text-center text-xl font-semibold tabular focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none sm:size-14',
            invalid && 'border-destructive',
          )}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, '').slice(-1);
            setAt(index, digit);
            if (digit) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digit) refs.current[index - 1]?.focus();
            if (event.key === 'ArrowLeft') refs.current[index - 1]?.focus();
            if (event.key === 'ArrowRight') refs.current[index + 1]?.focus();
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (!pasted) return;
            event.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
        />
      ))}
    </div>
  );
}
