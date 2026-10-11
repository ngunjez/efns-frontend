import { SkipLink } from '@/components/common/SkipLink';
import { SiteFooter } from '@/components/layout/client/SiteFooter';
import { SiteHeader } from '@/components/layout/client/SiteHeader';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
