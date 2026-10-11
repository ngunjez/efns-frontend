import type { Metadata } from 'next';
import { StaffGuard } from '@/components/layout/staff/StaffGuard';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Client-facing hub devices (welcome tablet, the bay's second monitor). They
 * run on an officer's enrolled device and session, without the staff chrome.
 */
export default function HubDeviceLayout({ children }: { children: React.ReactNode }) {
  return <StaffGuard idleLock={false}>{children}</StaffGuard>;
}
