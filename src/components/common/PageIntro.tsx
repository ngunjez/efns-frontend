import { cn } from '@/lib/utils';

/** Big page title and lead paragraph used at the top of client screens. */
export function PageIntro({
  title,
  body,
  className,
  children,
}: {
  title: string;
  body?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <h1 className="text-h1">{title}</h1>
      {body && <p className="text-lead text-muted-foreground">{body}</p>}
      {children}
    </div>
  );
}
