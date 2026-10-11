'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/layout/staff/AuthCard';
import { reportError } from '@/lib/monitoring';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => reportError(error, { digest: error.digest }), [error]);
  return (
    <AuthCard
      title="Something went wrong"
      description="This screen hit an unexpected problem. Your work on other screens is not affected."
    >
      <Button onClick={reset}>Try again</Button>
    </AuthCard>
  );
}
