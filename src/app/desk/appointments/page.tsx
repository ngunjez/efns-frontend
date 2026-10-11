import type { Metadata } from 'next';
import { AppointmentsBoard } from '@/components/features/desk/AppointmentsBoard';

export const metadata: Metadata = { title: 'Appointments' };

export default function Page() {
  return <AppointmentsBoard />;
}
