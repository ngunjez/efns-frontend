'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MonitorSmartphone } from 'lucide-react';
import { useFloorHost, usePriorityOverride } from '@/api/hooks/use-desk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DefinitionList } from '@/components/common/DefinitionList';
import { FormField } from '@/components/common/FormField';
import { MultiSelect } from '@/components/common/MultiSelect';
import { QueryState } from '@/components/common/QueryState';
import { TicketNumber } from '@/components/common/TicketNumber';
import type { WaitingTicket } from '@/types/desk';
import { LiveItem, LiveList } from '@/components/motion/LiveList';

const REASONS = [
  'Senior citizen, mobility support',
  'Person with a disability',
  'Expectant mother',
  'With an infant',
  'Medical or distress',
];
const ROUTES = ['Bay 01, accessible counter', 'Next available bay', 'Executive suite'];
const ASSISTANCE = [
  'Lowered counter',
  'Companion present',
  'Kiswahili',
  'Sign language',
  'Wheelchair',
].map((value) => ({ value, label: value }));

export function FloorHost() {
  const query = useFloorHost();
  const [selected, setSelected] = useState<WaitingTicket | null>(null);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card>
        <CardHeader>
          <CardTitle>Waiting in the hall</CardTitle>
          {query.data && <Badge tone="warning">{query.data.waiting.length} waiting</Badge>}
        </CardHeader>
        <CardContent>
          <QueryState query={query} isEmpty={(data) => data.waiting.length === 0}>
            {(data) => (
              <LiveList className="grid gap-2">
                {data.waiting.map((ticket) => (
                  <LiveItem key={ticket.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(ticket)}
                      className="flex w-full items-center gap-4 rounded-field border p-3 text-left hover:border-primary hover:bg-primary-tint/40"
                    >
                      <span className="rounded-control bg-primary-tint px-2.5 py-1 font-bold text-primary tabular">
                        {ticket.number}
                      </span>
                      <span className="flex-1 font-medium">{ticket.service}</span>
                      <span className="text-sm text-muted-foreground">
                        Waiting {ticket.waitingMinutes} min
                      </span>
                    </button>
                  </LiveItem>
                ))}
              </LiveList>
            )}
          </QueryState>
          <p className="mt-4 text-xs text-muted-foreground">Tap a ticket to help that client.</p>
        </CardContent>
      </Card>

      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Floor host</CardTitle>
          </CardHeader>
          <CardContent>
            {query.data && (
              <DefinitionList
                dense
                rows={[
                  { label: 'On the floor since', value: query.data.onFloorSince },
                  { label: 'Checked in today', value: query.data.checkedInToday },
                  { label: 'Priority today', value: query.data.priorityToday },
                  { label: 'Languages', value: query.data.languages },
                ]}
              />
            )}
          </CardContent>
        </Card>
        <Button asChild size="lg" variant="outline">
          <Link href="/hub/welcome">
            <MonitorSmartphone aria-hidden /> Open the welcome screen
          </Link>
        </Button>
      </div>

      {selected && <PriorityOverrideDialog ticket={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PriorityOverrideDialog({
  ticket,
  onClose,
}: {
  ticket: WaitingTicket;
  onClose: () => void;
}) {
  const override = usePriorityOverride();
  const [reason, setReason] = useState<string>();
  const [routeTo, setRouteTo] = useState<string>();
  const [assistance, setAssistance] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [alertSupervisor, setAlertSupervisor] = useState(true);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Priority override</DialogTitle>
          <DialogDescription>
            Move a client to the priority queue when they need assistance and came in through the
            general queue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-field border p-4">
          <TicketNumber value={ticket.number} className="text-2xl text-muted-foreground" />
          <ArrowRight className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-2xl font-bold text-primary">Priority</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Moves ahead of the general queue
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Reason" required>
            {(control) => (
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger {...control}>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField label="Route to" required>
            {(control) => (
              <Select value={routeTo} onValueChange={setRouteTo}>
                <SelectTrigger {...control}>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {ROUTES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField label="Assistance needed" className="sm:col-span-2">
            {(control) => (
              <MultiSelect
                {...control}
                options={ASSISTANCE}
                value={assistance}
                onChange={setAssistance}
              />
            )}
          </FormField>
          <FormField label="Note for the officer" className="sm:col-span-2">
            {(control) => (
              <Textarea
                {...control}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            )}
          </FormField>
          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <span className="grid">
              <label htmlFor="alert-supervisor" className="text-sm font-semibold">
                Alert the floor supervisor
              </label>
              <span className="text-xs text-muted-foreground">
                The override is written to the exception ledger.
              </span>
            </span>
            <Switch
              id="alert-supervisor"
              checked={alertSupervisor}
              onCheckedChange={setAlertSupervisor}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!reason || !routeTo}
            loading={override.isPending}
            onClick={() =>
              reason &&
              routeTo &&
              override.mutate(
                { ticketId: ticket.id, reason, routeTo, assistance, note, alertSupervisor },
                { onSuccess: onClose },
              )
            }
          >
            Elevate to priority
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
