import type { Metadata } from 'next';
import { ReceptionCounter } from '@/components/features/desk/reception/ReceptionCounter';

export const metadata: Metadata = { title: 'Document check' };

export default function ReceptionPage() {
  return <ReceptionCounter />;
}
