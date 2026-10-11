import { cn } from '@/lib/utils';

export function TicketNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('text-ticket font-bold tracking-tight text-primary tabular', className)}>
      {value}
    </span>
  );
}
