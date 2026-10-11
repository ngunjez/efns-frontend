import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimelineStep } from '@/types/domain';

/** Application milestones: done, current (ring) and upcoming (grey). */
export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn('divide-y', className)}>
      {steps.map((step) => (
        <li
          key={step.label}
          aria-current={step.state === 'current' ? 'step' : undefined}
          className="flex items-center gap-3 py-3"
        >
          {step.state === 'done' ? (
            <CheckCircle2 className="size-6 shrink-0 fill-success text-white" aria-hidden />
          ) : (
            <span
              aria-hidden
              className={cn(
                'size-6 shrink-0 rounded-full',
                step.state === 'current' ? 'border-[3px] border-primary' : 'bg-muted',
              )}
            />
          )}
          <span
            className={cn(
              'flex-1',
              step.state === 'current' && 'font-semibold',
              step.state === 'upcoming' && 'text-muted-foreground',
            )}
          >
            {step.label}
          </span>
          {step.date && <span className="text-sm text-muted-foreground">{step.date}</span>}
        </li>
      ))}
    </ol>
  );
}
