import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type CheckState = 'done' | 'pending' | 'failed';

const icons = {
  done: <CheckCircle2 className="size-6 fill-success text-white" aria-hidden />,
  pending: <Circle className="size-6 text-input" aria-hidden />,
  failed: <XCircle className="size-6 fill-destructive text-white" aria-hidden />,
} satisfies Record<CheckState, React.ReactNode>;

/** A green-tick row: document checklists, screening checks, collection checks. */
export function CheckItem({
  label,
  state = 'done',
  trailing,
  boxed,
  className,
}: {
  label: string;
  state?: CheckState;
  trailing?: React.ReactNode;
  boxed?: boolean;
  className?: string;
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-3',
        boxed ? 'rounded-card border bg-card px-4 py-3.5' : 'py-2',
        className,
      )}
    >
      {icons[state]}
      <span className={cn('flex-1', boxed && 'text-lead font-medium')}>{label}</span>
      {trailing}
      <span className="sr-only">
        {state === 'done' ? 'complete' : state === 'failed' ? 'failed' : 'pending'}
      </span>
    </li>
  );
}
