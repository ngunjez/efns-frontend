import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { site } from '@/config/site';

/** Centred card used by every staff sign-in, refusal and lock screen (frames 79–83). */
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-background p-gutter">
      <Card className="grid w-full max-w-md gap-6 p-6 sm:p-8">
        <Logo name={site.name} size="sm" />
        <div className="grid gap-1.5">
          <h1 className="text-h3">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </Card>
    </main>
  );
}
