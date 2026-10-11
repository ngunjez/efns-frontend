'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMe } from '@/api/hooks/use-auth';
import { env } from '@/config/env';
import { permissionForPath } from '@/config/navigation';
import { hasPermission } from '@/config/permissions';
import { useIdleTimer } from '@/hooks/use-idle-timer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { locked, signedIn } from '@/store/slices/auth-slice';
import { ErrorState, LoadingBlock } from '@/components/common/QueryState';
import { LockScreen } from './LockScreen';

export function StaffGuard({
  children,
  idleLock = true,
}: {
  children: React.ReactNode;
  idleLock?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const me = useMe();
  const user = useAppSelector((state) => state.auth.user);
  const isLocked = useAppSelector((state) => state.auth.locked);

  useEffect(() => {
    if (me.data) dispatch(signedIn(me.data));
  }, [me.data, dispatch]);

  const allowed = user ? hasPermission(user.permissions, permissionForPath(pathname)) : false;

  useEffect(() => {
    if (user && !allowed) router.replace(`/unauthorized?from=${encodeURIComponent(pathname)}`);
  }, [user, allowed, pathname, router]);

  useIdleTimer(
    env.idleLockMinutes,
    () => dispatch(locked()),
    idleLock && Boolean(user) && !isLocked,
  );

  if (!user && me.isError && me.error.status !== 401) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <ErrorState error={me.error} onRetry={() => me.refetch()} />
      </div>
    );
  }

  if (!user || !allowed) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <LoadingBlock rows={3} className="w-80" />
      </div>
    );
  }

  return <>{isLocked ? <LockScreen /> : children}</>;
}
