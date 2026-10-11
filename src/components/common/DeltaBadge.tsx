import { Badge } from '@/components/ui/badge';
import type { Kpi } from '@/types/domain';

export function DeltaBadge({ delta }: { delta?: Kpi['delta'] }) {
  if (!delta) return null;
  return (
    <Badge tone={delta.tone} className="px-1.5 text-[0.6875rem]">
      {delta.value}
    </Badge>
  );
}
