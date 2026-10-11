import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeTone } from '@/components/ui/badge';

const tones: Record<BadgeTone, string> = {
  info: 'bg-primary-tint text-primary',
  success: 'bg-success-tint text-success-foreground',
  warning: 'bg-warning-tint text-warning-foreground',
  danger: 'bg-destructive-tint text-destructive-foreground',
  neutral: 'bg-neutral-tint text-muted-foreground',
};

export function IconTile({
  icon: Icon,
  tone = 'info',
  className,
}: {
  icon: LucideIcon;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-grid size-9 shrink-0 place-items-center rounded-control',
        tones[tone],
        className,
      )}
    >
      <Icon className="size-[1.125rem]" />
    </span>
  );
}
