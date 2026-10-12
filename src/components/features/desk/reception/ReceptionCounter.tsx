'use client';

import { useArrivals, useCaseCommand } from '@/api/hooks/use-desk';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState, LoadingBlock, QueryState } from '@/components/common/QueryState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LiveItem, LiveList } from '@/components/motion/LiveList';
import { CaseConsole } from '../case/CaseConsole';

export function ReceptionCounter() {
  const arrivals = useArrivals();
  const command = useCaseCommand();

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Arrived, documents to check</CardTitle>
          {arrivals.data && <Badge tone="warning">{arrivals.data.length}</Badge>}
        </CardHeader>
        <CardContent>
          <QueryState
            query={arrivals}
            loading={<LoadingBlock rows={3} className="p-0" />}
            isEmpty={(items) => items.length === 0}
            empty={
              <EmptyState
                title="Nobody waiting"
                detail="Clients appear here once the floor host logs their visit."
                className="py-6"
              />
            }
          >
            {(items) => (
              <LiveList className="grid gap-2">
                {items.map((arrival) => (
                  <LiveItem key={arrival.id}>
                    <button
                      type="button"
                      onClick={() =>
                        command.mutate({ name: 'open-arrival', payload: { id: arrival.id } })
                      }
                      className="grid w-full gap-1 rounded-field border p-3 text-start transition-colors hover:border-primary hover:bg-primary-tint/40"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{arrival.name}</span>
                        <StatusBadge status={arrival.stream} />
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {arrival.service}, pass {arrival.pass}, arrived {arrival.arrivedAt}
                      </span>
                    </button>
                  </LiveItem>
                ))}
              </LiveList>
            )}
          </QueryState>
        </CardContent>
      </Card>
      <CaseConsole
        flow="reception"
        idle={
          <Card>
            <EmptyState
              title="Choose an arrival"
              detail="Pick a client on the left to check what they brought against the service checklist, then issue their queue ticket."
            />
          </Card>
        }
      />
    </div>
  );
}
