import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StaffSignIn } from '@/components/features/staff-auth/StaffSignIn';

export const metadata: Metadata = { title: 'Staff sign-in' };

export default function StaffSignInPage() {
  return (
    <Suspense>
      <StaffSignIn />
    </Suspense>
  );
}
