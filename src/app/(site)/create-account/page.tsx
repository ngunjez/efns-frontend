import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CreateAccountWizard } from '@/components/features/account/CreateAccountWizard';

export const metadata: Metadata = { title: 'Create account' };

export default function CreateAccountPage() {
  return (
    <Suspense>
      <CreateAccountWizard />
    </Suspense>
  );
}
