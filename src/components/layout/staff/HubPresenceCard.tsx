'use client';

import Link from 'next/link';
import { useHubStatus } from '@/api/hooks/use-desk';
import { Button } from '@/components/ui/button';

export function HubPresenceCard() {
  const { data } = useHubStatus();
  return (
    <div className="grid gap-2 rounded-card bg-primary-tint p-4 text-center">
      <span className="text-sm text-muted-foreground">Clients in hub now</span>
      <span className="text-3xl font-bold tabular" aria-live="polite">
        {data?.clientsInHub ?? '—'}
      </span>
      <Button asChild size="sm">
        <Link href="/desk/journey-board">Open Journey Board</Link>
      </Button>
    </div>
  );
}
