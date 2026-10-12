import type { BadgeTone } from '@/components/ui/badge';

export interface Service {
  id: string;
  name: string;
  summary: string;
  icon: string;
  governmentFee: number;
  serviceCharge: number;
  turnaround: string;
  documents: string[];
}

export interface Hub {
  id: string;
  name: string;
  town: string;
  code: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Status {
  label: string;
  tone: BadgeTone;
}

export interface Appointment {
  id: string;
  time: string;
  client: string;
  service: string;
  phone: string;
  status: Status;
  canCheckIn: boolean;
}

export interface QueueTicket {
  id: string;
  number: string;
  service: string;
  waitingMinutes: number;
  stream: Status;
}

export interface CalledTicket {
  number: string;
  bay: string;
  service: string;
}

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface TimelineStep {
  label: string;
  date?: string;
  state: 'done' | 'current' | 'upcoming';
}

export interface ApplicationSummary {
  reference: string;
  service: string;
  clientName: string;
  stage: StageNumber;
  status: Status;
  timeline: TimelineStep[];
  documentRequest: { title: string; detail: string; dueBy: string } | null;
  passport: string | null;
  readyToCollect: {
    hub: string;
    output: string;
    rows: { label: string; value: string }[];
    bring: string[];
  } | null;
  hubSupport: { phone: string; email: string };
}

export interface Device {
  name: string;
  status: Status;
}

export interface Kpi {
  label: string;
  value: string;
  delta?: { value: string; tone: BadgeTone };
}
