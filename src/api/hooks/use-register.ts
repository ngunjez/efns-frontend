import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { ListParams } from '@/types/api';
import type { CustomField, RegisterResponse, RegisterRow } from '@/types/register';

export function useRegister(key: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.register.list(key, params),
    queryFn: () => request.get<RegisterResponse>(ENDPOINTS.registers(key).list, params),
    placeholderData: keepPreviousData,
  });
}

export function useSaveRecord(key: string, successMessage: string) {
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: Record<string, unknown> }) =>
      id
        ? request.patch<RegisterRow>(ENDPOINTS.registers(key).detail(id), values)
        : request.post<RegisterRow>(ENDPOINTS.registers(key).list, values),
    meta: { successMessage, invalidates: [queryKeys.register.all(key)] },
  });
}

export function useDeleteRecord(key: string, successMessage: string) {
  return useMutation({
    mutationFn: ({ id, reassignTo }: { id: string; reassignTo?: string }) =>
      request.delete<void>(
        ENDPOINTS.registers(key).detail(id),
        reassignTo ? { reassignTo } : undefined,
      ),
    meta: { successMessage, invalidates: [queryKeys.register.all(key)] },
  });
}

export function useRecordAction(key: string) {
  return useMutation({
    mutationFn: ({
      id,
      action,
      values,
    }: {
      id: string;
      action: string;
      values?: Record<string, unknown>;
    }) => request.post<void>(`${ENDPOINTS.registers(key).detail(id)}/${action}`, values),
    meta: { invalidates: [queryKeys.register.all(key)] },
  });
}

export function useCustomFields(page: string) {
  return useQuery({
    queryKey: queryKeys.customFields(page),
    queryFn: () => request.get<CustomField[]>(ENDPOINTS.customFields(page)),
    enabled: Boolean(page),
    staleTime: 10 * 60_000,
  });
}

export function useSaveCustomField(page: string) {
  return useMutation({
    mutationFn: ({ name, field }: { name?: string; field: Omit<CustomField, 'name'> }) =>
      name
        ? request.patch<CustomField>(ENDPOINTS.customField(page, name), field)
        : request.post<CustomField>(ENDPOINTS.customFields(page), field),
    meta: {
      successMessage: 'Field saved. It now shows on the page.',
      invalidates: [queryKeys.customFields(page), ['registers', 'modules']],
    },
  });
}

export function useDeleteCustomField(page: string) {
  return useMutation({
    mutationFn: (name: string) => request.delete<void>(ENDPOINTS.customField(page, name)),
    meta: {
      successMessage: 'Field deleted.',
      invalidates: [queryKeys.customFields(page), ['registers', 'modules']],
    },
  });
}
