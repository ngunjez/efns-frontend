'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppointments, useCheckIn } from '@/api/hooks/use-desk';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { Appointment } from '@/types/domain';
import { BookForClientDrawer } from './BookForClientDrawer';

type Row = Appointment & Record<string, unknown>;

export function AppointmentsBoard() {
  const query = useAppointments();
  const checkIn = useCheckIn();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: ColumnDef<Row>[] = [
    { key: 'time', header: 'Time', kind: 'strong' },
    { key: 'client', header: 'Client' },
    { key: 'service', header: 'Service', hideBelow: 'sm' },
    { key: 'phone', header: 'Phone', kind: 'muted', hideBelow: 'md' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'checkIn',
      header: '',
      align: 'right',
      render: (row) =>
        row.canCheckIn ? (
          <Button
            size="sm"
            loading={checkIn.isPending && checkIn.variables === row.id}
            onClick={() => checkIn.mutate(row.id)}
          >
            Check in<span className="sr-only">: {row.client}</span>
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Appointments"
        description={`${query.data?.dateLabel ?? 'Today'}. Check each booked client in when they arrive.`}
        actions={
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus aria-hidden /> Book appointment
          </Button>
        }
      />
      <Card>
        <DataTable
          columns={columns as ColumnDef[]}
          rows={(query.data?.items ?? []) as Row[]}
          loading={query.isPending}
          error={query.isError ? query.error : null}
          onRetry={() => query.refetch()}
          emptyTitle="No appointments today"
        />
      </Card>
      <BookForClientDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
