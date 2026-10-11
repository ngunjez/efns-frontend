import type { Metadata } from 'next';
import { ServicePoint } from '@/components/features/desk/ServicePoint';

export const metadata: Metadata = { title: 'Service Point' };

export default function Page() {
  return <ServicePoint />;
}
