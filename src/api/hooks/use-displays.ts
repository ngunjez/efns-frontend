import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { BayDisplayView, HallDisplayView } from '@/types/desk';
import type { CustomerDisplayView } from '@/types/journey';

/** Wall displays poll quickly: a called ticket must appear within seconds. */
const DISPLAY = { refetchInterval: 4_000 } as const;

export function useHallDisplay() {
  return useQuery({
    queryKey: queryKeys.displays.hall,
    queryFn: () => request.get<HallDisplayView>(ENDPOINTS.displays.hall),
    ...DISPLAY,
  });
}

export function useBayDisplay(bay: string) {
  return useQuery({
    queryKey: queryKeys.displays.bay(bay),
    queryFn: () => request.get<BayDisplayView>(ENDPOINTS.displays.bay(bay)),
    ...DISPLAY,
  });
}

/** The case open on this bay's customer-facing screen, with whatever the current step needs. */
export function useCustomerDisplay() {
  return useQuery({
    queryKey: queryKeys.displays.customer,
    queryFn: () => request.get<CustomerDisplayView>(ENDPOINTS.displays.customer),
    ...DISPLAY,
  });
}
