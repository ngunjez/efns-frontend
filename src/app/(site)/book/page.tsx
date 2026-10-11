import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BookAppointment } from '@/components/features/booking/BookAppointment';

export const metadata: Metadata = { title: 'Book an appointment' };

export default function BookPage() {
  return (
    <Suspense>
      <BookAppointment />
    </Suspense>
  );
}
