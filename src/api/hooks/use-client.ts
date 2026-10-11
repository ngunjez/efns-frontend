import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { ApplicationSummary } from '@/types/domain';
import type { ClientCategory, ClientUser } from '@/types/auth';

export interface RegisterClientInput {
  category: ClientCategory;
  documentNumber: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  phone: string;
  email: string;
  password: string;
}

export function useClientSignIn() {
  return useMutation({
    mutationFn: (input: { identifier: string; password: string }) =>
      request.post<ClientUser>(ENDPOINTS.client.signIn, input),
    meta: { silentError: true, invalidates: [queryKeys.client.me] },
  });
}

/** Frames 92–96: one call once the three wizard steps are complete; an SMS code follows. */
export function useRegisterClient() {
  return useMutation({
    mutationFn: (input: RegisterClientInput) =>
      request.post<{ verificationId: string }>(ENDPOINTS.client.register, input),
  });
}

/** Frame 97. */
export function useVerifyPhone() {
  return useMutation({
    mutationFn: (input: { verificationId: string; code: string }) =>
      request.post<ClientUser>(ENDPOINTS.client.verifyPhone, input),
    meta: { silentError: true, invalidates: [queryKeys.client.me] },
  });
}

/** The signed-in client, or null for a visitor. Drives "My application" in the header (frame 89). */
export function useClientSession() {
  return useQuery({
    queryKey: queryKeys.client.me,
    queryFn: () => request.get<ClientUser | null>(ENDPOINTS.client.me).catch(() => null),
    staleTime: 5 * 60_000,
  });
}

/**
 * Frames 101, 38, 39, 41. A signed-in client reads their own application; a
 * walk-in follows the tracking link from the SMS with the reference instead.
 */
export function useApplication(reference?: string) {
  return useQuery({
    queryKey: reference ? queryKeys.client.track(reference) : queryKeys.client.application,
    queryFn: () =>
      request.get<ApplicationSummary | null>(
        reference ? ENDPOINTS.client.track(reference) : ENDPOINTS.client.application,
      ),
  });
}

export function useUploadRequestedDocument(reference: string) {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request.upload<void>(ENDPOINTS.client.uploadDocument(reference), form);
    },
    meta: { invalidates: [queryKeys.client.track(reference), queryKeys.client.application] },
  });
}
