'use client';

import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import * as m from 'motion/react-m';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { filterNavigation, navigationByApp, type AppKey } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sidebarCollapseToggled, sidebarOpenChanged } from '@/store/slices/ui-slice';
import { NotificationsBell } from './NotificationsBell';
import { Sidebar } from './Sidebar';
import { SkipLink } from '@/components/common/SkipLink';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserMenu } from './UserMenu';

export interface AppShellProps {
  brand: string;
  app: AppKey;
  topbarStart?: React.ReactNode;
  topbarEnd?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({
  brand,
  app,
  topbarStart,
  topbarEnd,
  sidebarFooter,
  children,
}: AppShellProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const sections = filterNavigation(navigationByApp[app], permissions);

  const sidebar = (onNavigate?: () => void) => (
    <Sidebar brand={brand} sections={sections} footer={sidebarFooter} onNavigate={onNavigate} />
  );

  return (
    <div
      className={cn(
        'min-h-dvh lg:grid',
        sidebarCollapsed ? 'lg:grid-cols-1' : 'lg:grid-cols-[16.5rem_minmax(0,1fr)]',
      )}
    >
      <SkipLink />

      {!sidebarCollapsed && (
        <aside className="sticky top-0 hidden h-dvh border-e lg:block">{sidebar()}</aside>
      )}

      <Sheet open={sidebarOpen} onOpenChange={(open) => dispatch(sidebarOpenChanged(open))}>
        <SheetContent side="left" className="w-72 sm:max-w-72" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar(() => dispatch(sidebarOpenChanged(false)))}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-gutter backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            className="lg:hidden"
            onClick={() => dispatch(sidebarOpenChanged(true))}
          >
            <PanelLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            aria-pressed={sidebarCollapsed}
            className="hidden lg:inline-flex"
            onClick={() => dispatch(sidebarCollapseToggled())}
          >
            <PanelLeft />
          </Button>
          <div className="min-w-0 flex-1">{topbarStart}</div>
          <div className="flex items-center gap-1 sm:gap-2">
            {topbarEnd}
            <ThemeToggle />
            <NotificationsBell />
            <UserMenu />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 p-gutter outline-none">
          <m.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {children}
          </m.div>
        </main>
      </div>
    </div>
  );
}
