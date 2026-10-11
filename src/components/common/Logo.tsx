import { cn } from '@/lib/utils';

/** The hub mark plus an optional wordmark. Decorative when a visible name sits beside it. */
export function Logo({
  name,
  subtitle,
  className,
  size = 'md',
}: {
  name?: string;
  subtitle?: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className={cn('shrink-0', size === 'sm' ? 'size-7' : 'size-9')}
      >
        <circle cx="20" cy="20" r="20" fill="#9BD12F" />
        <path
          d="M9 27c6-1 13-7 17-16"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 31c6-2 12-8 15-15"
          stroke="#4E9A1F"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {name && (
        <span className="grid leading-tight">
          <span className={cn('font-bold', size === 'sm' ? 'text-base' : 'text-lg sm:text-xl')}>
            {name}
          </span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </span>
      )}
    </span>
  );
}
