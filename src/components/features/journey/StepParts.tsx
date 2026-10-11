import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Step title, with the green tick when the step reports something complete. */
export function StepHeading({
  title,
  body,
  done,
  className,
}: {
  title: string;
  body?: string;
  done?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <h1 className="flex items-center gap-3 text-h1">
        {done && (
          <CheckCircle2 className="size-[1.1em] shrink-0 fill-success text-white" aria-hidden />
        )}
        {title}
      </h1>
      {body && <p className="max-w-3xl text-lead text-muted-foreground">{body}</p>}
    </div>
  );
}

/** Right-aligned primary actions at the foot of a step; stacks on phones. */
export function StepActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{children}</div>;
}
