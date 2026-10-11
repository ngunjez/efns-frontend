import { cn } from '@/lib/utils';

/** A queue ticket number set for reading at a distance. */
export function TicketNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('text-ticket font-bold tracking-tight text-primary tabular', className)}>
      {value}
    </span>
  );
}
