import { Badge } from '@/components/ui/badge';
import type { Status } from '@/types/domain';

/** Statuses arrive from the API as label + tone, so wording and colour stay server-controlled. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge tone={status.tone} className={className}>
      {status.label}
    </Badge>
  );
}
