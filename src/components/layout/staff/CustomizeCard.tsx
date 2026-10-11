import Link from 'next/link';
import { Button } from '@/components/ui/button';

/** Bottom-left of Admin: add modules and fields without a release. */
export function CustomizeCard() {
  return (
    <div className="grid gap-2 rounded-card bg-primary-tint p-4 text-center">
      <span className="font-semibold">Need a new module?</span>
      <span className="text-xs text-muted-foreground">
        Add your own sections and fields from Settings
      </span>
      <Button asChild size="sm">
        <Link href="/admin/settings/modules">Open Settings</Link>
      </Button>
    </div>
  );
}
