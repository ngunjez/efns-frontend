import { cn } from '@/lib/utils';

/**
 * "Step 1 of 3: Category … Next: Your details" over a segmented bar.
 * Used by the account wizard and, via StageProgress, the 12-stage journey.
 */
export function StepProgress({
  current,
  total,
  label,
  nextLabel,
  stepNames,
  ariaLabel,
  className,
}: {
  current: number;
  total: number;
  label: string;
  nextLabel?: string;
  /** Screen-reader names for each segment. */
  stepNames?: string[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="font-semibold">{label}</span>
        {nextLabel && <span className="text-muted-foreground">{nextLabel}</span>}
      </div>
      <ol className="flex gap-1 sm:gap-1.5" aria-label={ariaLabel}>
        {Array.from({ length: total }, (_, index) => {
          const number = index + 1;
          const state = number < current ? 'done' : number === current ? 'current' : 'upcoming';
          return (
            <li
              key={number}
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                state === 'done' ? 'bg-success' : state === 'current' ? 'bg-primary' : 'bg-muted',
              )}
            >
              <span className="sr-only">{stepNames?.[index] ?? number}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
