import { Progress } from '@/components/ui/progress';
import type { MeterItem } from '@/types/register';

export function MeterList({ items }: { items: MeterItem[] }) {
  return (
    <ul className="grid gap-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="grid grid-cols-[minmax(7rem,10rem)_1fr_auto] items-center gap-3 text-sm"
        >
          <span className="truncate">{item.label}</span>
          <Progress value={item.value} tone={item.tone} label={item.label} className="h-2.5" />
          <span className="w-16 text-end text-muted-foreground tabular">{item.display}</span>
        </li>
      ))}
    </ul>
  );
}
