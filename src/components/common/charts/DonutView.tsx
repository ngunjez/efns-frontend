'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export const DONUT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export default function DonutView({
  slices,
  total,
  caption,
}: {
  slices: { label: string; value: number }[];
  total: string;
  caption: string;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius="72%"
            outerRadius="100%"
            paddingAngle={1}
            stroke="none"
          >
            {slices.map((slice, index) => (
              <Cell key={slice.label} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-xs text-muted-foreground">{caption}</span>
        <span className="text-xl font-bold tabular">{total}</span>
      </div>
    </div>
  );
}
