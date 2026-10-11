'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Info } from 'lucide-react';
import { useMe } from '@/api/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/layout/staff/AuthCard';
import { adminNavigation, deskNavigation, homeForPermissions } from '@/config/navigation';

const titles = new Map(
  [...deskNavigation, ...adminNavigation].flatMap((section) =>
    section.items.flatMap((item) =>
      (item.children ?? [item]).map((link) => [link.href, link.title] as const),
    ),
  ),
);

/** Frame 82: a role opened a screen it is not allowed. Points back to the role's own home. */
function NoAccess() {
  const from = useSearchParams().get('from') ?? '';
  const { data: user } = useMe();
  const home = user ? homeForPermissions(user.permissions) : '/staff/sign-in';
  const screen =
    [...titles.entries()].find(([href]) => href && from.startsWith(href))?.[1] ?? 'This screen';

  return (
    <AuthCard title="You do not have access">
      <div className="flex gap-3 rounded-control bg-warning-tint p-4 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />
        <p>
          <strong className="block">{screen} is not part of your role.</strong>
          {user ? `Your role, ${user.roleLabel}, can open other screens. ` : ''}A Platform
          Administrator can change what a role opens.
        </p>
      </div>
      <Button asChild>
        <Link href={home}>Back to {titles.get(home) ?? 'sign-in'}</Link>
      </Button>
    </AuthCard>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense>
      <NoAccess />
    </Suspense>
  );
}
