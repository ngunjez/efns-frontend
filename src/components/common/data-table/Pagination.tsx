import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const visible = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === pages || Math.abs(number - page) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
    >
      <p className="text-muted-foreground" aria-live="polite">
        Showing {from} to {to} of {total} entries
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {visible.map((number, index) => (
          <span key={number} className="flex items-center">
            {index > 0 && visible[index - 1] !== number - 1 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <Button
              variant="outline"
              size="sm"
              aria-current={number === page ? 'page' : undefined}
              className={cn('min-w-9 px-2', number === page && 'border-primary text-primary')}
              onClick={() => onPageChange(number)}
            >
              {number}
            </Button>
          </span>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
