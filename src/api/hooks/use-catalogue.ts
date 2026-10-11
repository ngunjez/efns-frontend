import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { Hub, Service, TimeSlot } from '@/types/domain';

const HOUR = 60 * 60_000;

export function useServices() {
  return useQuery({
    queryKey: queryKeys.catalogue.services,
    queryFn: () => request.get<Service[]>(ENDPOINTS.catalogue.services),
    staleTime: HOUR,
  });
}

export function useHubs() {
  return useQuery({
    queryKey: queryKeys.catalogue.hubs,
    queryFn: () => request.get<Hub[]>(ENDPOINTS.catalogue.hubs),
    staleTime: HOUR,
  });
}

export function useSlots(params: { serviceId?: string; hubId?: string; date?: string }) {
  const { serviceId = '', hubId = '', date = '' } = params;
  return useQuery({
    queryKey: queryKeys.catalogue.slots(serviceId, hubId, date),
    queryFn: () => request.get<TimeSlot[]>(ENDPOINTS.catalogue.slots, { serviceId, hubId, date }),
    enabled: Boolean(serviceId && hubId && date),
  });
}

export interface BookingInput {
  serviceId: string;
  hubId: string;
  date: string;
  time: string;
  client?: string;
}

export interface Booking {
  code: string;
  service: string;
  hub: string;
  date: string;
  time: string;
  email: string;
  documents: string[];
}

export function useBookAppointment() {
  return useMutation({
    mutationFn: (input: BookingInput) => request.post<Booking>(ENDPOINTS.appointments.list, input),
    meta: { invalidates: [queryKeys.appointments, queryKeys.client.appointment] },
  });
}
