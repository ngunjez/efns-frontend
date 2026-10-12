'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCustomFields,
  useDeleteRecord,
  useRecordAction,
  useRegister,
  useRegisterCommand,
  useSaveRecord,
} from '@/api/hooks/use-register';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, type ColumnDef, type RowAction } from '@/components/common/data-table';
import { FormDrawer, type FormDefinition } from '@/components/common/dynamic-form';
import { PageHeader } from '@/components/common/PageHeader';
import { SummaryCard } from '@/components/common/SummaryCard';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn } from '@/lib/utils';
import type { RegisterRow } from '@/types/register';
import type { HeaderAction, PageDefinition, WidgetDef } from './types';
import { Reveal } from '@/components/motion/Reveal';
import { Widget } from './Widget';

const HIGHLIGHT_MS = 6000;

export function RegisterPage({ definition }: { definition: PageDefinition }) {
  const { key, form, remove } = definition;
  const pageSize = definition.pageSize ?? 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const query = useRegister(key, { page, pageSize, search: debouncedSearch || undefined });
  const customFields = useCustomFields(key);

  const [drawer, setDrawer] = useState<{ open: boolean; record?: RegisterRow }>({ open: false });
  const [deleting, setDeleting] = useState<RegisterRow | null>(null);
  const [acting, setActing] = useState<{
    row: RegisterRow;
    action: RowAction & { form: FormDefinition };
  } | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [command, setCommand] = useState<HeaderAction | null>(null);

  const save = useSaveRecord(key, form?.successMessage ?? 'Saved.');
  const destroy = useDeleteRecord(key, remove?.successMessage ?? 'Deleted.');
  const rowAction = useRecordAction(key);
  const runCommand = useRegisterCommand(key);

  useEffect(() => {
    if (!highlightId) return;
    const timer = setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlightId]);

  const summary = query.data?.summary;
  const rows = query.data?.data ?? [];

  const extraColumns = useMemo<ColumnDef[]>(
    () =>
      (customFields.data ?? [])
        .filter((field) => field.showInTable)
        .map((field) => ({ key: field.name, header: field.label })),
    [customFields.data],
  );

  const submit = async (values: Record<string, unknown>) => {
    const saved = await save.mutateAsync({ id: drawer.record?.id, values });
    setDrawer({ open: false });
    if (!drawer.record) setHighlightId(saved.id);
  };

  const handleRowAction = (action: string, row: RegisterRow, actions: RowAction[] = []) => {
    const definition = actions.find((item) => item.action === action);
    if (action === 'edit') setDrawer({ open: true, record: row });
    else if (action === 'delete') setDeleting(row);
    else if (definition?.form)
      setActing({ row, action: definition as RowAction & { form: FormDefinition } });
    else
      rowAction.mutate(
        { id: row.id, action },
        { onSuccess: () => toast.success(`${definition?.label ?? 'Action'}: done.`) },
      );
  };

  const renderWidget = (widget: WidgetDef, index: number) => {
    if (widget.type !== 'table') {
      return (
        <Widget
          key={widget.id ?? index}
          def={widget}
          data={summary?.widgets?.[widget.id]}
          pageKey={key}
        />
      );
    }
    return (
      <Card key="table" className="min-w-0">
        <DataTable
          title={widget.title}
          columns={[...widget.columns, ...extraColumns]}
          rows={rows}
          loading={query.isFetching}
          error={query.isError ? query.error : null}
          onRetry={() => query.refetch()}
          search={{
            value: search,
            onChange: (value) => {
              setSearch(value);
              setPage(1);
            },
            placeholder: widget.searchPlaceholder,
          }}
          pagination={
            query.data
              ? { page, pageSize, total: query.data.meta.total, onPageChange: setPage }
              : undefined
          }
          selectable={widget.selectable}
          rowActions={widget.rowActions}
          actionStyle={widget.actionStyle}
          onRowAction={(action, row) => handleRowAction(action, row, widget.rowActions)}
          highlightId={highlightId}
        />
      </Card>
    );
  };

  const cards = summary?.cards ?? [];
  const nameOf = (row: RegisterRow) => String(row[remove?.nameKey ?? 'name'] ?? '');

  return (
    <Reveal className="grid gap-5">
      <div
        className={cn(
          'grid gap-5',
          cards.length > 0 && 'xl:grid-cols-[minmax(0,2fr)_repeat(var(--cards),minmax(0,1fr))]',
        )}
        style={{ '--cards': cards.length } as React.CSSProperties}
      >
        <PageHeader
          title={definition.title}
          description={definition.description}
          stats={summary?.stats}
          actions={
            (form || definition.headerActions || definition.customizable) && (
              <>
                {definition.headerActions?.map((item, index) => (
                  <Button
                    key={item.action}
                    variant={index === 0 && !form ? 'default' : 'outline'}
                    onClick={() => setCommand(item)}
                  >
                    <Plus aria-hidden /> {item.label}
                  </Button>
                ))}
                {form && (
                  <Button onClick={() => setDrawer({ open: true })}>
                    <Plus aria-hidden /> {definition.createLabel ?? form.submitLabel}
                  </Button>
                )}
                {definition.customizable && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/settings/modules">
                      <Pencil aria-hidden /> Customize page
                    </Link>
                  </Button>
                )}
              </>
            )
          }
        />
        {cards.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:contents">
            {cards.map((card) => (
              <SummaryCard key={card.label} card={card} />
            ))}
          </div>
        )}
      </div>

      {definition.rows.map((row, index) => (
        <div
          key={index}
          className={cn(
            'grid items-start gap-5',
            row.aside && 'xl:grid-cols-[minmax(0,1fr)_20rem]',
          )}
        >
          <div className="grid min-w-0 gap-5">{row.main.map(renderWidget)}</div>
          {row.aside && <div className="grid gap-5">{row.aside.map(renderWidget)}</div>}
        </div>
      ))}

      {form && (
        <FormDrawer
          open={drawer.open}
          onOpenChange={(open) => setDrawer((current) => ({ ...current, open }))}
          definition={{ ...form, customFieldsPage: form.customFieldsPage ?? key }}
          record={drawer.record}
          saving={save.isPending}
          onSubmit={submit}
        />
      )}

      {command && (
        <FormDrawer
          open
          onOpenChange={(open) => !open && setCommand(null)}
          definition={{ ...command.form, customFieldsPage: command.form.customFieldsPage ?? key }}
          saving={runCommand.isPending}
          onSubmit={(values) =>
            runCommand.mutateAsync({ name: command.action, values }).then((result) => {
              toast.success(command.form.successMessage);
              if (result && 'id' in result) setHighlightId(result.id);
              setCommand(null);
            })
          }
        />
      )}

      {acting && (
        <FormDrawer
          open
          onOpenChange={(open) => !open && setActing(null)}
          definition={acting.action.form}
          saving={rowAction.isPending}
          onSubmit={(values) =>
            rowAction
              .mutateAsync({ id: acting.row.id, action: acting.action.action, values })
              .then(() => {
                toast.success(acting.action.form.successMessage);
                setActing(null);
              })
          }
        />
      )}

      {remove && deleting && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setDeleting(null)}
          title={remove.title}
          description={remove.description.replace('{name}', nameOf(deleting))}
          loading={destroy.isPending}
          reassign={
            remove.reassignLabel
              ? {
                  label: remove.reassignLabel,
                  options: rows
                    .filter((row) => row.id !== deleting.id)
                    .map((row) => ({ value: row.id, label: nameOf(row) })),
                }
              : undefined
          }
          onConfirm={(reassignTo) =>
            destroy.mutate({ id: deleting.id, reassignTo }, { onSuccess: () => setDeleting(null) })
          }
        />
      )}
    </Reveal>
  );
}
