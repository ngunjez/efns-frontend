'use client';

import { useMemo, useState } from 'react';
import { Columns3, MoreVertical, Pencil, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ApiError } from '@/types/api';
import { EmptyState, ErrorState, LoadingBlock } from '../QueryState';
import { Cell } from './cells';
import { Pagination } from './Pagination';
import type { ColumnDef, RowAction } from './types';

type Row = { id: string } & Record<string, unknown>;

const hideClass = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
} as const;

export interface DataTableProps {
  title?: string;
  columns: ColumnDef<Row>[];
  rows: Row[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  search?: { value: string; onChange: (value: string) => void; placeholder: string };
  loading?: boolean;
  error?: ApiError | null;
  onRetry?: () => void;
  selectable?: boolean;
  rowActions?: RowAction[];
  actionStyle?: 'icons' | 'menu';
  onRowAction?: (action: string, row: Row) => void;
  highlightId?: string | null;
  toolbar?: React.ReactNode;
  emptyTitle?: string;
}

export function DataTable({
  title,
  columns,
  rows,
  pagination,
  search,
  loading,
  error,
  onRetry,
  selectable,
  rowActions,
  actionStyle = 'menu',
  onRowAction,
  highlightId,
  toolbar,
  emptyTitle = 'No records found',
}: DataTableProps) {
  const [hidden, setHidden] = useState(
    () => new Set(columns.filter((column) => column.hiddenByDefault).map((column) => column.key)),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const visibleColumns = useMemo(
    () => columns.filter((column) => !hidden.has(column.key)),
    [columns, hidden],
  );
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const hasActions = Boolean(rowActions?.length);

  const toggleRow = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const body = (() => {
    if (loading && rows.length === 0) return <LoadingBlock rows={5} />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (rows.length === 0)
      return (
        <EmptyState
          title={emptyTitle}
          detail={search?.value ? 'Try a different search.' : undefined}
        />
      );
    return null;
  })();

  return (
    <div className="grid">
      {(title || search || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
          {title && <h2 className="text-[1.0625rem] font-semibold">{title}</h2>}
          <div className="flex flex-wrap items-center gap-2">
            {search && (
              <label className="relative">
                <span className="sr-only">{search.placeholder}</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="search"
                  value={search.value}
                  onChange={(event) => search.onChange(event.target.value)}
                  placeholder={search.placeholder}
                  className="h-9 w-full min-w-52 rounded-control border bg-card pr-3 pl-9 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
                />
              </label>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 aria-hidden /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Show columns</DropdownMenuLabel>
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={!hidden.has(column.key)}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={(checked) =>
                      setHidden((current) => {
                        const next = new Set(current);
                        if (checked) next.delete(column.key);
                        else next.add(column.key);
                        return next;
                      })
                    }
                  >
                    {column.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {toolbar}
          </div>
        </div>
      )}

      {body ?? (
        <Table aria-busy={loading || undefined}>
          {title && <TableCaption>{title}</TableCaption>}
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all rows"
                    checked={allSelected ? true : selected.size > 0 ? 'indeterminate' : false}
                    onCheckedChange={(checked) =>
                      setSelected(checked ? new Set(rows.map((row) => row.id)) : new Set())
                    }
                  />
                </TableHead>
              )}
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.align === 'right' && 'text-right',
                    column.hideBelow && hideClass[column.hideBelow],
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
              {hasActions && <TableHead className="w-16 text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isNew = highlightId === row.id;
              return (
                <TableRow
                  key={row.id}
                  data-state={selected.has(row.id) ? 'selected' : undefined}
                  data-highlight={isNew || undefined}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        aria-label="Select row"
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((column, index) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        column.align === 'right' && 'text-right',
                        column.hideBelow && hideClass[column.hideBelow],
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Cell column={column as ColumnDef<Record<string, unknown>>} row={row} />
                        {isNew && index === 0 && <Badge tone="success">New</Badge>}
                      </span>
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="text-right">
                      <RowActions
                        actions={rowActions!}
                        style={actionStyle}
                        onAction={(action) => onRowAction?.(action, row)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {pagination && !body && <Pagination {...pagination} />}
    </div>
  );
}

function RowActions({
  actions,
  style,
  onAction,
}: {
  actions: RowAction[];
  style: 'icons' | 'menu';
  onAction: (action: string) => void;
}) {
  if (style === 'icons') {
    return (
      <span className="inline-flex gap-1">
        {actions.map((item) => {
          const Icon = item.action === 'delete' ? Trash2 : Pencil;
          return (
            <Button
              key={item.action}
              variant="ghost"
              size="icon"
              aria-label={item.label}
              onClick={() => onAction(item.action)}
            >
              <Icon className="text-muted-foreground" />
            </Button>
          );
        })}
      </span>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Row actions">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((item) => (
          <DropdownMenuItem
            key={item.action}
            variant={item.destructive ? 'destructive' : undefined}
            onSelect={() => onAction(item.action)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
