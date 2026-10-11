import type { Metadata } from 'next';
import { StaffGuard } from '@/components/layout/staff/StaffGuard';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function HubDeviceLayout({ children }: { children: React.ReactNode }) {
  return <StaffGuard idleLock={false}>{children}</StaffGuard>;
}
