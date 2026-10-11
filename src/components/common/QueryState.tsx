import type { UseQueryResult } from '@tanstack/react-query';
import { AlertTriangle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ApiError } from '@/types/api';

export function EmptyState({
  title,
  detail,
  className,
}: {
  title: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={cn('grid place-items-center gap-2 px-6 py-12 text-center', className)}>
      <Inbox className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-semibold">{title}</p>
      {detail && <p className="max-w-sm text-sm text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error: ApiError | null;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn('grid place-items-center gap-3 px-6 py-12 text-center', className)}
    >
      <AlertTriangle className="size-8 text-destructive" aria-hidden />
      <p className="max-w-sm text-sm">{error?.message ?? 'Something went wrong.'}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function LoadingBlock({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('grid gap-3 p-5', className)} aria-busy aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-10" />
      ))}
    </div>
  );
}

export function QueryState<T>({
  query,
  children,
  loading,
  isEmpty,
  empty,
}: {
  query: UseQueryResult<T, ApiError>;
  children: (data: T) => React.ReactNode;
  loading?: React.ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: React.ReactNode;
}) {
  if (query.isPending) return <>{loading ?? <LoadingBlock />}</>;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  if (isEmpty?.(query.data)) return <>{empty ?? <EmptyState title="Nothing here yet" />}</>;
  return <>{children(query.data)}</>;
}
