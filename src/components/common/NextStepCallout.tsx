import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NextStepCallout({
  eyebrow,
  title,
  detail,
  className,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn('flex items-center gap-4 rounded-card bg-primary-tint p-4 sm:p-5', className)}
    >
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
      >
        <ArrowRight className="size-5" />
      </span>
      <div className="grid gap-0.5">
        <span className="text-xs text-muted-foreground">{eyebrow}</span>
        <span className="text-lg font-semibold">{title}</span>
        {detail && <span className="text-sm text-muted-foreground">{detail}</span>}
      </div>
    </aside>
  );
}
