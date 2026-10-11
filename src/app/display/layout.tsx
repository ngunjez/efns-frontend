import type { Metadata } from 'next';
import { StaffGuard } from '@/components/layout/staff/StaffGuard';

export const metadata: Metadata = { title: 'Display', robots: { index: false, follow: false } };

export default function DisplayLayout({ children }: { children: React.ReactNode }) {
  return <StaffGuard idleLock={false}>{children}</StaffGuard>;
}
