import { useMutation, useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { Appointment } from '@/types/domain';
import type {
  ClientLookup,
  FloorboardView,
  FloorHostView,
  HubStatus,
  NotificationItem,
  StationAction,
  StationView,
  SupportView,
  WorkbenchView,
} from '@/types/desk';

/** Live floor data refreshes on a short interval until the realtime channel is specified. */
const LIVE = { refetchInterval: 15_000, refetchIntervalInBackground: false } as const;

export function useHubStatus() {
  return useQuery({
    queryKey: queryKeys.desk.hubStatus,
    queryFn: () => request.get<HubStatus>(ENDPOINTS.desk.hubStatus),
    ...LIVE,
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments,
    queryFn: () =>
      request.get<{ dateLabel: string; items: Appointment[] }>(ENDPOINTS.appointments.list),
    ...LIVE,
  });
}

export function useCheckIn() {
  return useMutation({
    mutationFn: (appointmentId: string) =>
      request.post<{ ticket: string }>(ENDPOINTS.appointments.checkIn(appointmentId)),
    meta: {
      successMessage: 'Checked in. The ticket is printing.',
      invalidates: [queryKeys.appointments, queryKeys.desk.all],
    },
  });
}

export function useClientLookup(query: string) {
  return useQuery({
    queryKey: queryKeys.desk.clientLookup(query),
    queryFn: () => request.get<ClientLookup>(ENDPOINTS.desk.clientLookup, { query }),
    enabled: query.trim().length >= 6,
  });
}

export function useFloorHost() {
  return useQuery({
    queryKey: queryKeys.desk.floorHost,
    queryFn: () => request.get<FloorHostView>(ENDPOINTS.desk.visits),
    ...LIVE,
  });
}

export interface PriorityOverrideInput {
  ticketId: string;
  reason: string;
  routeTo: string;
  assistance: string[];
  note?: string;
  alertSupervisor: boolean;
}

export function usePriorityOverride() {
  return useMutation({
    mutationFn: (input: PriorityOverrideInput) =>
      request.post<{ ticket: string }>(ENDPOINTS.desk.priorityOverride, input),
    meta: { successMessage: 'Moved to the priority queue.', invalidates: [queryKeys.desk.all] },
  });
}

export function useStation() {
  return useQuery({
    queryKey: queryKeys.desk.station,
    queryFn: () => request.get<StationView>(ENDPOINTS.desk.station),
    ...LIVE,
  });
}

export function useStationAction() {
  return useMutation({
    mutationFn: ({
      action,
      payload,
    }: {
      action: StationAction;
      payload?: Record<string, unknown>;
    }) => request.post<StationView>(ENDPOINTS.desk.stationAction(action), payload),
    meta: { invalidates: [queryKeys.desk.all] },
  });
}

export function useSetStationStatus() {
  return useMutation({
    mutationFn: (status: string) => request.post<void>(ENDPOINTS.desk.stationStatus, { status }),
    meta: { invalidates: [queryKeys.desk.station] },
  });
}

export function useFloorboard() {
  return useQuery({
    queryKey: queryKeys.desk.floorboard,
    queryFn: () => request.get<FloorboardView>(ENDPOINTS.desk.floorboard),
    ...LIVE,
  });
}

export type FloorboardAction = 'push-next' | 'rotate-bay' | 'rotate-idle' | 'change-service';

/** Hub Manager actions on the floor (frame 23): push a ticket, rotate bays, retype a bay. */
export function useFloorboardAction() {
  return useMutation({
    mutationFn: ({
      action,
      payload,
    }: {
      action: FloorboardAction;
      payload?: Record<string, unknown>;
    }) => request.post<void>(ENDPOINTS.desk.floorboardAction(action), payload),
    meta: { successMessage: 'Floor updated.', invalidates: [queryKeys.desk.floorboard] },
  });
}

export function useWorkbench() {
  return useQuery({
    queryKey: queryKeys.desk.workbench,
    queryFn: () => request.get<WorkbenchView>(ENDPOINTS.desk.workbench),
  });
}

export type CaseDecision = 'accept' | 'approve' | 'return' | 'reject';

export function useCaseDecision() {
  return useMutation({
    mutationFn: ({
      caseId,
      decision,
      reason,
    }: {
      caseId: string;
      decision: CaseDecision;
      reason?: string;
    }) => request.post<void>(ENDPOINTS.desk.caseAction(caseId), { decision, reason }),
    meta: { invalidates: [queryKeys.desk.all] },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.desk.notifications,
    queryFn: () => request.get<NotificationItem[]>(ENDPOINTS.desk.notifications),
    ...LIVE,
  });
}

export function useSupportCase(caseId: string) {
  return useQuery({
    queryKey: queryKeys.desk.support(caseId),
    queryFn: () => request.get<SupportView>(ENDPOINTS.desk.support(caseId)),
  });
}

export function useAddSupportNote(caseId: string) {
  return useMutation({
    mutationFn: (body: string) =>
      request.post<void>(`${ENDPOINTS.desk.support(caseId)}/notes`, { body }),
    meta: {
      successMessage: 'Note added to the case.',
      invalidates: [queryKeys.desk.support(caseId)],
    },
  });
}

export type ContactChannel = 'call' | 'whatsapp' | 'sms' | 'email';

/** Starts outbound contact through the contact-centre integration; the result lands in the conversation. */
export function useContactClient(caseId: string) {
  return useMutation({
    mutationFn: (channel: ContactChannel) =>
      request.post<void>(`${ENDPOINTS.desk.support(caseId)}/contact`, { channel }),
    meta: {
      successMessage: 'Contact started. It will appear in the conversation.',
      invalidates: [queryKeys.desk.support(caseId)],
    },
  });
}
