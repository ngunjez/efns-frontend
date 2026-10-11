'use client';

import { MapPin } from 'lucide-react';
import { useHubs } from '@/api/hooks/use-catalogue';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryState } from '@/components/common/QueryState';

/** Accredited hubs. A hub appears here only after it passes the go-live gate. */
export function HubList() {
  const query = useHubs();
  return (
    <QueryState query={query} loading={<Skeleton className="h-24 rounded-card" />}>
      {(hubs) => (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
          {hubs.map((hub) => (
            <li key={hub.id}>
              <Card className="grid gap-2 p-4">
                <MapPin className="size-5 text-primary" aria-hidden />
                <span className="grid">
                  <span className="font-semibold">{hub.name}</span>
                  <span className="text-sm text-muted-foreground">{hub.town}</span>
                </span>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </QueryState>
  );
}
