import { Badge } from '@/components/ui/badge';
import type { Status } from '@/types/domain';

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge tone={status.tone} className={className}>
      {status.label}
    </Badge>
  );
}
