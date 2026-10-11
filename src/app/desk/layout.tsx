import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/staff/AppShell';
import { HubPresenceCard } from '@/components/layout/staff/HubPresenceCard';
import { StaffGuard } from '@/components/layout/staff/StaffGuard';
import { DeskTitle } from '@/components/features/desk/DeskTitle';
import { StationStatusMenu } from '@/components/features/desk/StationStatusMenu';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: { default: 'Service Desk', template: `%s · ${site.deskName}` },
  robots: { index: false, follow: false },
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffGuard>
      <AppShell
        brand={site.deskName}
        app="desk"
        topbarStart={<DeskTitle />}
        topbarEnd={<StationStatusMenu />}
        sidebarFooter={<HubPresenceCard />}
      >
        {children}
      </AppShell>
    </StaffGuard>
  );
}
