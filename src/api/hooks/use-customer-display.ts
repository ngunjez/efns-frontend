import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { JourneyStep } from '@/types/journey';

/** Something the client confirms on the second screen: "Everything is correct", a signature, a rating. */
export function useCustomerAction() {
  return useMutation({
    mutationFn: (input: { step: JourneyStep; action: string; payload?: Record<string, unknown> }) =>
      request.post<void>(ENDPOINTS.displays.customerAction, input),
    meta: { invalidates: [queryKeys.displays.customer] },
  });
}
