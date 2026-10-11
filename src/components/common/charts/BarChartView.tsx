'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '@/types/register';

export interface SeriesDef {
  key: string;
  label: string;
  /** CSS colour, normally a chart token: var(--chart-1). */
  color: string;
}

/** Monthly bars, optionally stacked (statutory fee + service charge, returned at verification + QA). */
export default function BarChartView({
  points,
  series,
  stacked,
  height = 260,
}: {
  points: ChartPoint[];
  series: SeriesDef[];
  stacked?: boolean;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={points}
        margin={{ top: 8, right: 4, bottom: 0, left: -16 }}
        barCategoryGap="28%"
      >
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          width={48}
        />
        <Tooltip
          cursor={{ fill: 'var(--muted)' }}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--card)',
          }}
        />
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            stackId={stacked ? 'stack' : undefined}
            fill={item.color}
            radius={!stacked || index === series.length - 1 ? [4, 4, 0, 0] : 0}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
