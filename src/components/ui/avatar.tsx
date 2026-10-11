import * as React from 'react';
import { cn, initials } from '@/lib/utils';

const tones = [
  'bg-teal-700',
  'bg-violet-500',
  'bg-sky-600',
  'bg-rose-500',
  'bg-amber-600',
  'bg-emerald-600',
] as const;

function Avatar({ name, className, ...props }: React.ComponentProps<'span'> & { name: string }) {
  const tone = tones[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % tones.length];
  return (
    <span
      data-slot="avatar"
      aria-hidden
      className={cn(
        'inline-grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white',
        tone,
        className,
      )}
      {...props}
    >
      {initials(name)}
    </span>
  );
}

export { Avatar };
