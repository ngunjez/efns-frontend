import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { StaffUser } from '@/types/auth';

export interface StaffSignInInput {
  email: string;
  password: string;
}

export function useStaffSignIn() {
  return useMutation({
    mutationFn: (input: StaffSignInInput) =>
      request.post<{ challengeId: string }>(ENDPOINTS.auth.staffSignIn, input),
    meta: { silentError: true },
  });
}

export function useVerifyStaffCode() {
  return useMutation({
    mutationFn: (input: { challengeId: string; code: string }) =>
      request.post<StaffUser>(ENDPOINTS.auth.staffVerify, input),
    meta: { silentError: true },
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => request.get<StaffUser>(ENDPOINTS.auth.me),
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useUnlock() {
  return useMutation({
    mutationFn: (password: string) => request.post<void>(ENDPOINTS.auth.unlock, { password }),
    meta: { silentError: true },
  });
}

export function useSignOut() {
  return useMutation({ mutationFn: () => request.post<void>(ENDPOINTS.auth.signOut) });
}
