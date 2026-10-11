import { cn } from '@/lib/utils';

const toneClass = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
} as const;

function Progress({
  value,
  tone = 'info',
  label,
  className,
}: {
  value: number;
  tone?: keyof typeof toneClass;
  label: string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width]', toneClass[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
