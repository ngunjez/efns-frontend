import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function PageSkeleton({
  variant = 'register',
  className,
}: {
  variant?: 'register' | 'content';
  className?: string;
}) {
  if (variant === 'content') {
    return (
      <div
        className={cn('container-page grid gap-6 py-section', className)}
        aria-busy
        aria-label="Loading"
      >
        <Skeleton className="h-12 w-2/3 max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-card" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={cn('grid gap-5', className)} aria-busy aria-label="Loading">
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr_1fr]">
        <Skeleton className="h-36 rounded-card" />
        <Skeleton className="hidden h-36 rounded-card xl:block" />
        <Skeleton className="hidden h-36 rounded-card xl:block" />
      </div>
      <Skeleton className="h-72 rounded-card" />
      <div className="grid gap-3 rounded-card border bg-card p-5">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
    </div>
  );
}
