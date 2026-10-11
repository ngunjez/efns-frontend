import { cn } from '@/lib/utils';

export interface DefinitionRow {
  label: string;
  value: React.ReactNode;
}

/** Label/value rows with hairline dividers — case details, invoices, receipts. */
export function DefinitionList({
  rows,
  className,
  dense,
}: {
  rows: DefinitionRow[];
  className?: string;
  dense?: boolean;
}) {
  return (
    <dl className={cn('divide-y', className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn('flex items-baseline justify-between gap-4', dense ? 'py-2' : 'py-3')}
        >
          <dt className="text-sm text-muted-foreground">{row.label}</dt>
          <dd className="text-right text-sm font-semibold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
