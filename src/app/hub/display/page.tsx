import type { Metadata } from 'next';
import { CustomerScreen } from '@/components/features/journey/CustomerScreen';

export const metadata: Metadata = { title: 'Client screen' };

export default function LiveClientScreen() {
  return <CustomerScreen />;
}
