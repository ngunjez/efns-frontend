import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';

/** Single-record settings such as Sign-in and privacy (frame 72). */
export function useSettings<T extends Record<string, unknown>>(key: string) {
  return useQuery({
    queryKey: queryKeys.settings(key),
    queryFn: () => request.get<T>(ENDPOINTS.settings(key)),
  });
}

export function useSaveSettings(key: string) {
  return useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      request.put<void>(ENDPOINTS.settings(key), values),
    meta: {
      successMessage: 'Setting saved. It applies from the next sign-in.',
      invalidates: [queryKeys.settings(key)],
    },
  });
}
