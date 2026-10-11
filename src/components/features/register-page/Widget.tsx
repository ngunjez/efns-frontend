'use client';

import dynamic from 'next/dynamic';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeltaBadge } from '@/components/common/DeltaBadge';
import { MeterList } from '@/components/common/MeterList';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import type { WidgetData } from '@/types/register';
import { DONUT_COLORS } from '@/components/common/charts/DonutView';
import { toast } from 'sonner';
import { useRecordAction } from '@/api/hooks/use-register';
import { customWidgets } from './custom-widgets';
import type { WidgetDef } from './types';

// Charts are client-only and heavy: split them out of the page bundle (handbook §11).
const BarChartView = dynamic(() => import('@/components/common/charts/BarChartView'), {
  ssr: false,
  loading: () => <Skeleton className="h-64" />,
});
const DonutView = dynamic(() => import('@/components/common/charts/DonutView'), {
  ssr: false,
  loading: () => <Skeleton className="mx-auto size-52 rounded-full" />,
});

const dotTone = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  neutral: 'bg-muted-foreground',
} as const;

type DataWidget = Exclude<WidgetDef, { type: 'table' } | { type: 'custom' }>;

/** Draws one non-table widget from its definition and the data the API sent for it. */
export function Widget({
  def,
  data,
  pageKey,
}: {
  def: Exclude<WidgetDef, { type: 'table' }>;
  data?: WidgetData;
  pageKey: string;
}) {
  if (def.type === 'custom') {
    const Custom = customWidgets[def.component];
    return <Custom />;
  }
  return (
    <Card className="h-full">
      <WidgetBody def={def} data={data} pageKey={pageKey} />
    </Card>
  );
}

function WidgetBody({
  def,
  data,
  pageKey,
}: {
  def: DataWidget;
  data?: WidgetData;
  pageKey: string;
}) {
  const recordAction = useRecordAction(pageKey);
  const header = (extra?: React.ReactNode, subtitle?: string) =>
    def.title ? (
      <CardHeader>
        <div className="grid gap-0.5">
          <CardTitle>{def.title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {extra}
      </CardHeader>
    ) : null;

  if (!data) {
    return (
      <>
        {header()}
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </>
    );
  }

  switch (data.kind) {
    case 'chart':
      return (
        <>
          {header(
            def.type === 'bar-chart' && (
              <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {def.series.map((series) => (
                  <li key={series.key} className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full"
                      style={{ background: series.color }}
                    />
                    {series.label}
                  </li>
                ))}
              </ul>
            ),
          )}
          <CardContent className="grid gap-3">
            {data.total && (
              <p className="flex items-center gap-2">
                <span className="text-2xl font-bold tabular">{data.total}</span>
                <DeltaBadge delta={data.delta} />
                {data.caption && (
                  <span className="text-xs text-muted-foreground">{data.caption}</span>
                )}
              </p>
            )}
            {def.type === 'bar-chart' && (
              <BarChartView points={data.points} series={def.series} stacked={def.stacked} />
            )}
          </CardContent>
        </>
      );
    case 'donut':
      return (
        <>
          {header()}
          <CardContent className="grid gap-5">
            <DonutView
              slices={data.slices}
              total={data.total}
              caption={def.type === 'donut' ? def.caption : ''}
            />
            <ul className="grid gap-2 text-sm">
              {data.slices.map((slice, index) => (
                <li key={slice.label} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-3 w-1 rounded-full"
                    style={{ background: DONUT_COLORS[index % DONUT_COLORS.length] }}
                  />
                  <span className="flex-1">{slice.label}</span>
                  <span className="font-semibold tabular">{slice.display}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </>
      );
    case 'meters':
      return (
        <>
          {header(data.badge && <Badge tone="info">{data.badge}</Badge>)}
          <CardContent className="grid gap-4">
            <MeterList items={data.items} />
            {data.caption && <p className="text-xs text-muted-foreground">{data.caption}</p>}
          </CardContent>
        </>
      );
    case 'list':
      return (
        <>
          {header(undefined, data.subtitle)}
          <CardContent>
            <ul
              className={cn(
                'grid',
                def.type === 'list' && def.variant === 'timeline' ? 'gap-4' : 'divide-y',
              )}
            >
              {data.items.map((item) => (
                <li
                  key={item.title}
                  className={cn(
                    'flex items-start gap-3',
                    !(def.type === 'list' && def.variant === 'timeline') && 'py-2.5 first:pt-0',
                  )}
                >
                  {item.tone && (
                    <span
                      aria-hidden
                      className={cn('mt-1.5 size-2 shrink-0 rounded-full', dotTone[item.tone])}
                    />
                  )}
                  <span className="grid flex-1 gap-0.5">
                    <span className="text-sm font-semibold">{item.title}</span>
                    {item.detail && (
                      <span className="text-xs text-muted-foreground">{item.detail}</span>
                    )}
                  </span>
                  {item.status && <StatusBadge status={item.status} />}
                </li>
              ))}
            </ul>
          </CardContent>
        </>
      );
    case 'tiles': {
      const columns = def.type === 'tiles' ? (def.columns ?? 4) : 4;
      return (
        <>
          {header()}
          <CardContent
            className={cn(
              'grid gap-3',
              { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[
                columns
              ],
            )}
          >
            {data.items.map((tile) => (
              <div key={tile.label} className="grid gap-1 rounded-field border p-4">
                <span className="text-xs text-muted-foreground">{tile.label}</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xl font-bold tabular">{tile.value}</span>
                  {tile.status && <StatusBadge status={tile.status} />}
                </span>
              </div>
            ))}
          </CardContent>
        </>
      );
    }
    case 'checklist':
      return (
        <>
          {header(undefined, data.subtitle)}
          <CardContent className="grid gap-4">
            <ul className="grid gap-3">
              {data.items.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  {item.done ? (
                    <CheckCircle2
                      className="size-5 shrink-0 fill-success text-white"
                      aria-label="Done"
                    />
                  ) : (
                    <Circle className="size-5 shrink-0 text-warning" aria-label="Outstanding" />
                  )}
                  <span className="grid">
                    <span className="text-sm font-semibold">{item.label}</span>
                    {item.detail && (
                      <span className="text-xs text-muted-foreground">{item.detail}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {data.note && (
              <p className="rounded-control bg-warning-tint p-3 text-xs text-warning-foreground">
                {data.note}
              </p>
            )}
            {data.action && (
              <Button
                className="w-full"
                disabled={!data.action.enabled}
                loading={recordAction.isPending}
                onClick={() => {
                  const { action } = data;
                  if (action)
                    recordAction.mutate(
                      { id: action.recordId, action: action.name },
                      { onSuccess: () => toast.success(`${action.label}: done.`) },
                    );
                }}
              >
                {data.action.label}
              </Button>
            )}
          </CardContent>
        </>
      );
  }
}
