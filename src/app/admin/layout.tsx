import type { Metadata } from 'next';
import { AdminSearch } from '@/components/features/admin/AdminSearch';
import { AppShell } from '@/components/layout/staff/AppShell';
import { CustomizeCard } from '@/components/layout/staff/CustomizeCard';
import { StaffGuard } from '@/components/layout/staff/StaffGuard';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: { default: 'Admin', template: `%s · ${site.adminName}` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffGuard>
      <AppShell
        brand={site.adminName}
        app="admin"
        topbarStart={<AdminSearch />}
        sidebarFooter={<CustomizeCard />}
      >
        {children}
      </AppShell>
    </StaffGuard>
  );
}
