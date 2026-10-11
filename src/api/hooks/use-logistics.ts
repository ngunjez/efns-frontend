import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { Status } from '@/types/domain';

export interface OpenManifest {
  id: string;
  status: Status;
  bagSeal: string;
  items: { item: string; application: string; register: string; scanned: boolean }[];
  handover: { destination: string; courier: string; runner: string; seal: string };
}

export function useOpenManifest() {
  return useQuery({
    queryKey: queryKeys.openManifest,
    queryFn: () => request.get<OpenManifest | null>(ENDPOINTS.logistics.openManifest),
  });
}

export function useScanItem() {
  return useMutation({
    mutationFn: (code: string) => request.post<OpenManifest>(ENDPOINTS.logistics.scan, { code }),
    meta: { invalidates: [queryKeys.openManifest] },
  });
}

export function useRecordHandover() {
  return useMutation({
    mutationFn: (signature: string) =>
      request.post<void>(ENDPOINTS.logistics.handover, { signature }),
    meta: {
      successMessage: 'Hand-over recorded. The consignment is in transit.',
      invalidates: [queryKeys.openManifest, ['registers', 'manifests']],
    },
  });
}
