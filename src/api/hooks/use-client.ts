import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { ApplicationSummary } from '@/types/domain';
import type { ClientCategory, ClientUser } from '@/types/auth';
import type { Booking } from './use-catalogue';

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

const clientKeys = [
  queryKeys.client.me,
  queryKeys.client.application,
  queryKeys.client.appointment,
];

export function useClientSignIn() {
  return useMutation({
    mutationFn: (input: { identifier: string; password: string }) =>
      request.post<ClientUser>(ENDPOINTS.client.signIn, input),
    meta: { silentError: true, invalidates: clientKeys },
  });
}

export function useClientSignOut() {
  return useMutation({
    mutationFn: () => request.post<void>(ENDPOINTS.client.signOut),
    meta: { invalidates: clientKeys },
  });
}

export function useRegisterClient() {
  return useMutation({
    mutationFn: (input: RegisterClientInput) =>
      request.post<{ verificationId: string }>(ENDPOINTS.client.register, input),
  });
}

export function useVerifyPhone() {
  return useMutation({
    mutationFn: (input: { verificationId: string; code: string }) =>
      request.post<void>(ENDPOINTS.client.verifyPhone, input),
    meta: { silentError: true },
  });
}

export function useClientSession() {
  return useQuery({
    queryKey: queryKeys.client.me,
    queryFn: () => request.get<ClientUser | null>(ENDPOINTS.client.me).catch(() => null),
    staleTime: 5 * 60_000,
  });
}

export function useApplication(reference?: string, enabled = true) {
  return useQuery({
    queryKey: reference ? queryKeys.client.track(reference) : queryKeys.client.application,
    queryFn: () =>
      request.get<ApplicationSummary | null>(
        reference ? ENDPOINTS.client.track(reference) : ENDPOINTS.client.application,
      ),
    enabled,
  });
}

export function useMyAppointment(enabled = true) {
  return useQuery({
    queryKey: queryKeys.client.appointment,
    queryFn: () => request.get<Booking | null>(ENDPOINTS.client.appointment),
    enabled,
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
