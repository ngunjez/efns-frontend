'use client';

import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { adminNavigation, deskNavigation, filterNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sidebarCollapseToggled, sidebarOpenChanged } from '@/store/slices/ui-slice';
import { NotificationsBell } from './NotificationsBell';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

// Navigation holds icon components, so it is resolved here on the client, not passed from a server layout.
const navigations = { desk: deskNavigation, admin: adminNavigation };

export interface AppShellProps {
  brand: string;
  app: keyof typeof navigations;
  /** Left of the top bar: the station title (desk) or the search box (admin). */
  topbarStart?: React.ReactNode;
  /** Right of the top bar, before the bell: e.g. the officer's live status chip. */
  topbarEnd?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  themeToggle?: boolean;
  children: React.ReactNode;
}

/**
 * The staff frame shared by the Service Desk and Admin apps: permission-filtered
 * sidebar (a drawer on small screens), top bar and main region.
 */
export function AppShell({
  brand,
  app,
  topbarStart,
  topbarEnd,
  sidebarFooter,
  themeToggle,
  children,
}: AppShellProps) {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const sections = filterNavigation(navigations[app], permissions);

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
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {!sidebarCollapsed && (
        <aside className="sticky top-0 hidden h-dvh border-r lg:block">{sidebar()}</aside>
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
            {themeToggle && <ThemeToggle />}
            <NotificationsBell />
            <UserMenu />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 p-gutter outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
