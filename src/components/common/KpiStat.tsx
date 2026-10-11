import { cn } from '@/lib/utils';
import type { Kpi } from '@/types/domain';
import { DeltaBadge } from './DeltaBadge';

export function KpiStat({
  kpi,
  size = 'md',
  className,
}: {
  kpi: Kpi;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={cn('grid min-w-0 gap-1', className)}>
      <span className="text-xs text-muted-foreground">{kpi.label}</span>
      <span className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'font-bold tabular',
            size === 'lg' ? 'text-2xl sm:text-[1.75rem]' : 'text-xl sm:text-2xl',
          )}
        >
          {kpi.value}
        </span>
        <DeltaBadge delta={kpi.delta} />
      </span>
    </div>
  );
}
