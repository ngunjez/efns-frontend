'use client';

import { useState } from 'react';
import { RefreshCcw, Shuffle } from 'lucide-react';
import { useServices } from '@/api/hooks/use-catalogue';
import { useFloorboard, useFloorboardAction } from '@/api/hooks/use-desk';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { useHasPermission } from '@/hooks/use-has-permission';
import { PERMISSIONS } from '@/config/permissions';
import { cn } from '@/lib/utils';
import type { FloorboardBay } from '@/types/desk';

const LEGEND = [
  { label: 'Available', tone: 'success' },
  { label: 'Serving', tone: 'warning' },
  { label: 'Wrap-up', tone: 'info' },
  { label: 'Break, idle or escalated', tone: 'neutral' },
  { label: 'Offline or over SLA', tone: 'danger' },
] as const;

const dot = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  neutral: 'bg-muted-foreground',
} as const;
const frame = {
  danger: 'border-destructive bg-destructive-tint/60',
  warning: 'border-warning bg-warning-tint/60',
  neutral: '',
  info: '',
  success: '',
} as const;

export function Floorboard() {
  const query = useFloorboard();
  const canReassign = useHasPermission(PERMISSIONS.officersReassign);
  const floorAction = useFloorboardAction();
  const [retyping, setRetyping] = useState(false);

  return (
    <QueryState query={query} loading={<LoadingBlock rows={8} />}>
      {(board) => (
        <div className="grid gap-5">
          <Card className="flex flex-wrap items-center justify-between gap-6 p-5">
            <div className="grid gap-1">
              <h1 className="text-xl font-semibold">{board.title}</h1>
              <p className="text-sm text-muted-foreground">Every bay, live. {board.updatedAt}</p>
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {board.stats.map((stat) => (
                <div key={stat.label} className="grid gap-0.5">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd
                    className={cn(
                      'text-xl font-bold tabular',
                      stat.tone === 'danger' && 'text-destructive-foreground',
                    )}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Legend">
              {LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <span aria-hidden className={cn('size-2.5 rounded-full', dot[item.tone])} />
                  {item.label}
                </li>
              ))}
            </ul>
            {canReassign && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setRetyping(true)}>
                  <Shuffle aria-hidden /> Change a bay service type
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  loading={floorAction.isPending}
                  onClick={() => floorAction.mutate({ action: 'rotate-idle' })}
                >
                  <RefreshCcw aria-hidden /> Put idle bays back in rotation
                </Button>
              </div>
            )}
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {board.bays.map((bay) => (
              <li key={bay.bay}>
                <BayCard bay={bay} />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Escalations show a neutral desk notice code only. Open the case to see why.
          </p>
          {retyping && (
            <ChangeServiceDialog
              bays={board.bays.map((bay) => bay.bay)}
              onClose={() => setRetyping(false)}
            />
          )}
        </div>
      )}
    </QueryState>
  );
}

function BayCard({ bay }: { bay: FloorboardBay }) {
  const action = useFloorboardAction();
  return (
    <Card className={cn('grid h-full gap-3 p-4', frame[bay.status.tone])}>
      <div className="flex items-start justify-between gap-2">
        <span className="grid leading-tight">
          <span className="font-semibold">{bay.bay}</span>
          <span className="text-xs text-muted-foreground">{bay.service}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span aria-hidden className={cn('size-2 rounded-full', dot[bay.status.tone])} />
          {bay.status.label}
        </span>
      </div>
      <span className="grid leading-tight">
        <span className="text-sm font-medium">{bay.officer ?? 'No officer'}</span>
        {bay.officerId && <span className="text-xs text-muted-foreground">{bay.officerId}</span>}
      </span>
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            'text-xl font-bold tabular',
            bay.ticket ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {bay.ticket ?? 'No ticket'}
        </span>
        <span className="text-sm font-semibold tabular">{bay.timer}</span>
      </div>
      <span className="text-xs text-muted-foreground">{bay.note}</span>
      {bay.action && (
        <Button
          variant="outline"
          size="sm"
          loading={action.isPending}
          onClick={() =>
            bay.action && action.mutate({ action: bay.action, payload: { bay: bay.bay } })
          }
        >
          {bay.action === 'push-next' ? 'Push next ticket' : 'Put back in rotation'}
        </Button>
      )}
    </Card>
  );
}

function ChangeServiceDialog({ bays, onClose }: { bays: string[]; onClose: () => void }) {
  const services = useServices();
  const action = useFloorboardAction();
  const [bay, setBay] = useState<string>();
  const [serviceId, setServiceId] = useState<string>();

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change a bay service type</DialogTitle>
          <DialogDescription>
            Only officers certified for the new service can be given its tickets.
          </DialogDescription>
        </DialogHeader>
        <FormField label="Bay" required>
          {(control) => (
            <Select value={bay} onValueChange={setBay}>
              <SelectTrigger {...control}>
                <SelectValue placeholder="Choose a bay" />
              </SelectTrigger>
              <SelectContent>
                {bays.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField label="Service" required>
          {(control) => (
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger {...control}>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.data?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!bay || !serviceId}
            loading={action.isPending}
            onClick={() =>
              action.mutate(
                { action: 'change-service', payload: { bay, serviceId } },
                { onSuccess: onClose },
              )
            }
          >
            Change service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
