'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeForPermissions, type AppKey } from '@/config/navigation';
import { useAppSelector } from '@/store/hooks';

export function AppHome({ app }: { app: AppKey }) {
  const router = useRouter();
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  useEffect(() => {
    if (permissions) router.replace(homeForPermissions(permissions, app));
  }, [permissions, router, app]);
  return null;
}
