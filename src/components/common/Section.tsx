import { cn } from '@/lib/utils';

/** A full-width page band with a heading — the rhythm of the public site. */
export function Section({
  id,
  title,
  description,
  tone = 'page',
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: string;
  tone?: 'page' | 'surface';
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('scroll-mt-20 py-section', tone === 'surface' && 'border-y bg-card', className)}
    >
      <div className="container-page grid gap-8">
        <div className="grid gap-1.5">
          <h2 id={headingId} className="text-h2">
            {title}
          </h2>
          {description && <p className="text-lead text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
