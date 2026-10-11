import type { Metadata } from 'next';
import { ClientSupport } from '@/components/features/desk/ClientSupport';

export const metadata: Metadata = { title: 'Client Support' };

export default function Page() {
  return <ClientSupport />;
}
