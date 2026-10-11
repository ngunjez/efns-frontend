'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { setSessionErrorHandler } from '@/api/axios';
import { useAppDispatch } from '@/store/hooks';
import { signedOut } from '@/store/slices/auth-slice';

const STAFF_AREAS = ['/desk', '/admin'];

export function SessionErrorRedirect() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    setSessionErrorHandler((error) => {
      const path = window.location.pathname;
      const isStaffArea = STAFF_AREAS.some((area) => path.startsWith(area));
      if (error.code === 'OUTSIDE_HUB') {
        dispatch(signedOut());
        queryClient.clear();
        router.replace('/staff/outside-hub');
      } else if (isStaffArea) {
        dispatch(signedOut());
        queryClient.clear();
        router.replace(`/staff/sign-in?next=${encodeURIComponent(path)}`);
      }
    });
    return () => setSessionErrorHandler(null);
  }, [dispatch, queryClient, router]);

  return null;
}
