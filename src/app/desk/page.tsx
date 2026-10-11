'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeForPermissions } from '@/config/navigation';
import { useAppSelector } from '@/store/hooks';

/** /desk opens the first station the signed-in role may use. */
export default function DeskHome() {
  const router = useRouter();
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  useEffect(() => {
    if (permissions) router.replace(homeForPermissions(permissions));
  }, [permissions, router]);
  return null;
}
