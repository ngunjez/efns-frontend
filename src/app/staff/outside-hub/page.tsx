import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/layout/staff/AuthCard';

export const metadata: Metadata = { title: 'Sign-in refused' };

/**
 * Frame 81: the location check (geofence layer 5) refused the session. The
 * attempt is already logged server-side and surfaced to the Hub Manager.
 */
export default function OutsideHubPage() {
  return (
    <AuthCard title="You can only sign in at your hub">
      <div role="alert" className="flex gap-3 rounded-control bg-destructive-tint p-4 text-sm">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
        <p>
          <strong className="block">This device is not inside your hub.</strong>
          Staff screens open only on registered devices inside the hub. This attempt has been
          recorded for your Hub Manager.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/staff/sign-in">Back to sign-in</Link>
      </Button>
    </AuthCard>
  );
}
