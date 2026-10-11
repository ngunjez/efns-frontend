import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Kpi } from '@/types/domain';
import { KpiStat } from './KpiStat';

export function PageHeader({
  title,
  description,
  stats,
  actions,
  className,
}: {
  title: string;
  description?: string;
  stats?: Kpi[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn('flex flex-wrap items-start justify-between gap-x-6 gap-y-4 p-5', className)}
    >
      <div className="grid min-w-0 flex-1 gap-4">
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && (
            <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {stats && stats.length > 0 && (
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((kpi) => (
              <KpiStat key={kpi.label} kpi={kpi} />
            ))}
          </dl>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
          {actions}
        </div>
      )}
    </Card>
  );
}
