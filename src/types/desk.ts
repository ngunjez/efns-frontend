import type { Device, QueueTicket, Status, CalledTicket, StageNumber } from './domain';

export interface HubStatus {
  hubName: string;
  clientsInHub: number;
}

export interface ClientLookup {
  found: boolean;
  name?: string;
  reference?: string;
}

export interface WaitingTicket {
  id: string;
  number: string;
  service: string;
  waitingMinutes: number;
}

export interface FloorHostView {
  waiting: WaitingTicket[];
  onFloorSince: string;
  checkedInToday: number;
  priorityToday: number;
  languages: string;
}

export interface StationView {
  bay: string;
  status: { key: string; label: string; tone: Status['tone'] };
  statusOptions: { key: string; label: string; hint?: string; group: 'status' | 'break' | 'end' }[];
  serving: {
    ticket: string;
    calledAt: string;
    targetMinutes: number;
    nextTicket: string | null;
    noShowSeconds: number;
  } | null;
  queue: (QueueTicket & { flag?: Status })[];
  currentCase: {
    id: string;
    status: Status;
    rows: { label: string; value: string }[];
  } | null;
  returnedCases: {
    id: string;
    ticket: string;
    reference: string;
    reason: string;
    returnedBy: string;
  }[];
  devices: Device[];
}

export type StationAction =
  | 'call-next'
  | 'recall'
  | 'no-show'
  | 'transfer'
  | 'hold'
  | 'elevate'
  | 'start-filing'
  | 'start-checkout'
  | 'route-to-qa'
  | 'show-on-display';

export interface FloorboardBay {
  bay: string;
  service: string;
  officer: string | null;
  officerId: string | null;
  ticket: string | null;
  timer: string;
  status: Status;
  note: string;
  action?: 'push-next' | 'rotate-bay';
}

export interface FloorboardView {
  title: string;
  updatedAt: string;
  stats: { label: string; value: string; tone?: Status['tone'] }[];
  bays: FloorboardBay[];
}

export interface WorkbenchView {
  mode: 'verify' | 'qa';
  case: {
    id: string;
    client: string;
    reference: string;
    service: string;
    ticket: string;
    stage: StageNumber;
    timeInHub: string;
    handleBudget: Status;
  };
  documents: {
    key: string;
    label: string;
    check: Status;
    mrz?: string[];
    meta: string;
    previewUrl?: string;
  }[];
  fields: { field: string; value: string; source: string; check: Status }[];
  matchSummary: Status;
  preparedBy: string;
  checkedBy: string;
  returnReasons: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: Status['tone'];
  href?: string;
  read: boolean;
}

export interface SupportView {
  client: {
    name: string;
    reference: string;
    rows: { label: string; value: string }[];
    status: Status;
  };
  conversation: {
    id: string;
    channel: string;
    direction: string;
    time: string;
    body: string;
    footnote?: string;
  }[];
  activity: { label: string; detail: string }[];
}

export interface HallDisplayView {
  hubName: string;
  announcement: string;
  now: CalledTicket;
  recent: CalledTicket[];
}

export interface BayDisplayView {
  bay: string;
  ticket: string | null;
}
