import { SiteFooter } from '@/components/layout/client/SiteFooter';
import { SiteHeader } from '@/components/layout/client/SiteHeader';

/** Public site and client portal (frames 89–101, 38–41). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
