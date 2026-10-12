'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardCheck, MonitorUp, PackageCheck, Receipt, Undo2 } from 'lucide-react';
import { useShowStep, useStation, useStationAction } from '@/api/hooks/use-desk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DefinitionList } from '@/components/common/DefinitionList';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TicketNumber } from '@/components/common/TicketNumber';
import { useElapsedSeconds } from '@/hooks/use-elapsed-seconds';
import { formatDuration, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CaseFlow } from '@/config/journey';
import type { StationAction, StationView } from '@/types/desk';
import type { JourneyStep } from '@/types/journey';
import { LiveItem, LiveList } from '@/components/motion/LiveList';

export function ServicePoint() {
  const query = useStation();
  return (
    <QueryState query={query} loading={<LoadingBlock rows={6} />}>
      {(station) => <Station station={station} />}
    </QueryState>
  );
}

function Station({ station }: { station: StationView }) {
  const router = useRouter();
  const show = useShowStep();
  const action = useStationAction();
  const openCase = (step: JourneyStep, flow: CaseFlow = 'filing') =>
    show.mutate(step, { onSuccess: () => router.push(`/desk/service-point/case?flow=${flow}`) });
  const run = (name: StationAction) => action.mutate({ action: name });
  const busy = (name: StationAction) => action.isPending && action.variables?.action === name;
  const elapsed = useElapsedSeconds(station.serving?.calledAt);
  const serving = station.serving;
  const noShowLeft = serving ? Math.max(0, serving.noShowSeconds - elapsed) : 0;

  return (
    <div className="grid gap-5">
      <Card className="grid gap-5 p-5 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-center">
        <div className="grid min-w-40 gap-0.5" aria-live="polite">
          {serving ? (
            <>
              <span className="text-xs text-muted-foreground">
                Serving, called {formatTime(serving.calledAt)}
              </span>
              <TicketNumber value={serving.ticket} className="text-4xl" />
              <span className="text-xs text-muted-foreground tabular">
                Elapsed {formatDuration(elapsed)}, target{' '}
                {formatDuration(serving.targetMinutes * 60)}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">No client called</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-6">
          <ActionTile
            primary
            title="Call next"
            hint={serving?.nextTicket ? `Next: ${serving.nextTicket}` : 'Queue empty'}
            loading={busy('call-next')}
            onClick={() => run('call-next')}
          />
          <ActionTile
            title="Recall / chime"
            hint="Flashes the hall display"
            disabled={!serving}
            onClick={() => run('recall')}
          />
          <ActionTile
            tone="warning"
            title="Mark no-show"
            hint={serving ? `${formatDuration(noShowLeft)} left` : '—'}
            disabled={!serving || noShowLeft > 0}
            onClick={() => run('no-show')}
          />
          <ActionTile
            title="Transfer bay"
            hint="To a specialist counter"
            disabled={!serving}
            onClick={() => run('transfer')}
          />
          <ActionTile
            title="Hold / park"
            hint="Keeps queue place"
            disabled={!serving}
            onClick={() => run('hold')}
          />
          <ActionTile
            title="Elevate"
            hint="To the supervisor"
            disabled={!serving}
            onClick={() => run('elevate')}
          />
        </div>
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          {station.returnedCases.length > 0 && (
            <Card className="border-warning">
              <CardHeader>
                <CardTitle>Returned to you</CardTitle>
                <Badge tone="warning">{station.returnedCases.length}</Badge>
              </CardHeader>
              <CardContent className="grid gap-3">
                {station.returnedCases.map((item) => (
                  <div key={item.id} className="grid gap-2 rounded-field bg-warning-tint p-3">
                    <p className="text-sm">
                      <strong>{item.ticket}</strong>, {item.reference}. Returned by{' '}
                      {item.returnedBy}: {item.reason}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="justify-self-start"
                      onClick={() => openCase('check-details')}
                    >
                      <Undo2 aria-hidden /> Open and correct
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Next in my queue</CardTitle>
              <Badge tone="warning">{station.queue.length} waiting</Badge>
            </CardHeader>
            <CardContent>
              <LiveList className="divide-y">
                {station.queue.map((ticket) => (
                  <LiveItem key={ticket.id} className="flex items-center gap-3 py-2.5">
                    <span className="rounded-control bg-primary-tint px-2 py-1 text-sm font-bold text-primary tabular">
                      {ticket.number}
                    </span>
                    <span className="grid flex-1 leading-tight">
                      <span className="text-sm font-semibold">{ticket.service}</span>
                      <span className="text-xs text-muted-foreground">
                        Waiting {ticket.waitingMinutes} min
                      </span>
                    </span>
                    <StatusBadge status={ticket.flag ?? ticket.stream} />
                  </LiveItem>
                ))}
              </LiveList>
              <p className="mt-3 text-xs text-muted-foreground">
                Order: executive, then priority, then appointments, then walk-ins by waiting time.
                Tickets only, no client names.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current case</CardTitle>
            {station.currentCase && <StatusBadge status={station.currentCase.status} />}
          </CardHeader>
          <CardContent className="grid gap-4">
            {station.currentCase ? (
              <>
                <DefinitionList dense rows={station.currentCase.rows} />
                <Button
                  size="lg"
                  loading={show.isPending}
                  onClick={() => openCase('check-details')}
                >
                  Client at the counter, start filing
                </Button>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => openCase('payment')}>
                    <Receipt aria-hidden /> Start checkout
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCase('collection', 'collection')}
                  >
                    <PackageCheck aria-hidden /> Collection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={busy('route-to-qa')}
                    onClick={() => run('route-to-qa')}
                  >
                    <ClipboardCheck aria-hidden /> Route to QA
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/hub/display" target="_blank" rel="noopener">
                      <MonitorUp aria-hidden /> Open customer display
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Call the next ticket to open a case.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:col-span-2 lg:grid-cols-2 2xl:col-span-1 2xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Customer display preview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid place-items-center gap-1 rounded-field bg-primary p-5 text-center text-primary-foreground">
                <span className="text-sm">It is your turn</span>
                <span className="text-3xl font-bold tabular">{serving?.ticket ?? '—'}</span>
                <span className="text-sm">Please go to {station.bay}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                What the client sees on the second monitor
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <DefinitionList
                dense
                rows={station.devices.map((device) => ({
                  label: device.name,
                  value: <StatusBadge status={device.status} />,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActionTile({
  title,
  hint,
  primary,
  tone,
  disabled,
  loading,
  onClick,
}: {
  title: string;
  hint: string;
  primary?: boolean;
  tone?: 'warning';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={primary ? 'default' : tone === 'warning' ? 'warning' : 'outline'}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={cn('h-auto flex-col gap-0.5 px-3 py-2.5 whitespace-normal')}
    >
      <span>{title}</span>
      <span
        className={cn(
          'text-xs font-normal',
          primary ? 'text-primary-foreground/80' : 'text-muted-foreground',
        )}
      >
        {hint}
      </span>
    </Button>
  );
}
