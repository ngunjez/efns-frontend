import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { iconFor } from '@/config/icons';
import { formatDate, formatDateTime, formatMoney, formatNumber } from '@/lib/format';
import { getByPath } from '@/lib/utils';
import { IconTile } from '../IconTile';
import type { ColumnDef } from './types';

type Row = Record<string, unknown>;

function humanize(value: string) {
  const text = value.replace(/[_-]+/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function asStatus(
  value: unknown,
  column: ColumnDef<Row>,
): { label: string; tone: BadgeTone } | null {
  if (value && typeof value === 'object' && 'label' in value)
    return value as { label: string; tone: BadgeTone };
  if (typeof value !== 'string' || !value) return null;
  return {
    label: column.labels?.[value] ?? humanize(value),
    tone: column.tones?.[value] ?? 'neutral',
  };
}

function Stacked({
  main,
  sub,
  strong,
}: {
  main: React.ReactNode;
  sub?: unknown;
  strong?: boolean;
}) {
  return (
    <span className="grid min-w-0">
      <span className={strong ? 'font-semibold' : undefined}>{main}</span>
      {sub != null && sub !== '' && (
        <span className="text-xs text-muted-foreground">{String(sub)}</span>
      )}
    </span>
  );
}

/** Renders one cell from its column definition. All register tables go through here. */
export function Cell({ column, row }: { column: ColumnDef<Row>; row: Row }) {
  if (column.render) return <>{column.render(row)}</>;
  const value = getByPath(row, column.key);
  const sub = column.subKey ? getByPath(row, column.subKey) : undefined;
  if (value == null || value === '') return <span className="text-muted-foreground">—</span>;

  switch (column.kind) {
    case 'strong':
      return <Stacked main={String(value)} sub={sub} strong />;
    case 'muted':
      return <span className="text-muted-foreground">{String(value)}</span>;
    case 'mono':
      return <span className="font-mono text-xs">{String(value)}</span>;
    case 'entity': {
      const tone = (column.toneKey ? getByPath(row, column.toneKey) : 'info') as BadgeTone;
      return (
        <span className="flex items-center gap-3">
          <IconTile icon={iconFor(column.icon)} tone={tone ?? 'info'} className="size-8" />
          <Stacked main={String(value)} sub={sub} strong />
        </span>
      );
    }
    case 'person':
      return (
        <span className="flex items-center gap-2.5">
          <Avatar name={String(value)} className="size-7 text-xs" />
          <Stacked main={String(value)} sub={sub} />
        </span>
      );
    case 'status': {
      const status = asStatus(value, column);
      return status ? <Badge tone={status.tone}>{status.label}</Badge> : null;
    }
    case 'statuses':
      return (
        <span className="flex flex-wrap gap-1">
          {(value as unknown[]).map((item, index) => {
            const status = asStatus(item, column);
            return status ? (
              <Badge key={index} tone={status.tone}>
                {status.label}
              </Badge>
            ) : null;
          })}
        </span>
      );
    case 'money':
      return <span className="whitespace-nowrap tabular">{formatMoney(Number(value))}</span>;
    case 'number':
      return <span className="tabular">{formatNumber(Number(value))}</span>;
    case 'percent':
      return <span className="tabular">{Number(value)}%</span>;
    case 'date':
      return <span className="whitespace-nowrap">{formatDate(String(value))}</span>;
    case 'datetime':
      return <span className="whitespace-nowrap">{formatDateTime(String(value))}</span>;
    case 'progress': {
      const raw = value as number | { value: number; tone?: BadgeTone; label?: string };
      const amount = typeof raw === 'number' ? raw : raw.value;
      const label = typeof raw === 'number' ? `${raw}%` : (raw.label ?? `${raw.value}%`);
      const thresholds = column.thresholds;
      const tone =
        typeof raw === 'object' && raw.tone
          ? raw.tone
          : thresholds
            ? amount >= thresholds.success
              ? 'success'
              : amount >= thresholds.warning
                ? 'warning'
                : 'danger'
            : 'info';
      return (
        <span className="grid min-w-24 gap-1">
          <span className="text-xs text-muted-foreground tabular">{label}</span>
          <Progress
            value={amount}
            tone={tone === 'neutral' ? 'info' : tone}
            label={`${column.header}: ${label}`}
          />
        </span>
      );
    }
    default:
      return <Stacked main={String(value)} sub={sub} />;
  }
}
