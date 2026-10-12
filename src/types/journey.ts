import type { Status } from './domain';

export type FingerState = 'captured' | 'retake' | 'pending';

export const JOURNEY_STEPS = [
  'welcome',
  'visit-logged',
  'documents',
  'ticket',
  'check-details',
  'consent',
  'documents-captured',
  'biometrics',
  'payment',
  'payment-confirmed',
  'provisional-slip',
  'lodgement',
  'submitted',
  'collection',
  'feedback',
] as const;

export type JourneyStep = (typeof JOURNEY_STEPS)[number];

export interface DetailSection {
  title: string;
  rows: { label: string; value: string }[];
}

export interface JourneyData {
  visitPass: {
    number: string;
    service: string;
    time: string;
    checks: string[];
    queues: { key: string; label: string; hint: string }[];
  };
  checklist: { label: string; done: boolean }[];
  missing: { title: string; detail: string } | null;
  ticket: { number: string; queue: string; ahead: number; estimate: string; sms: boolean };
  details: DetailSection[];
  consentText: string;
  passport: { mrz: string[]; rows: { label: string; value: string }[] };
  documents: { label: string; status: Status }[];
  biometrics: {
    left: FingerState[];
    right: FingerState[];
    captured: string;
    photo: Status;
    issue: { title: string; detail: string; finger: string } | null;
    attempts: number[] | null;
    lowest: string | null;
    manager: { name: string; role: string };
  };
  invoice: {
    service: string;
    total: number;
    methods: { key: string; label: string; hint: string }[];
    phone: string;
    state: 'awaiting' | 'verifying' | 'confirmed';
    expiresInSeconds: number;
  };
  receipt: { number: string; rows: { label: string; value: string }[] };
  provisional: { number: string; rows: { label: string; value: string }[] };
  lodgement: { receipt: string; rows: { label: string; value: string }[] };
  acknowledgement: { reference: string; rows: { label: string; value: string }[] };
  collection: { checks: string[]; rows: { label: string; value: string }[] };
}

export interface SyncItem {
  label: string;
  savedAt: string;
}

export interface OfflineState {
  since: string;
  pending: SyncItem[];
}

export type ReviewState = 'none' | 'pending' | 'approved' | 'returned';

export interface CustomerDisplayView {
  hubName: string;
  officer: string;
  ticket: string;
  client: { name: string; reference: string };
  step: JourneyStep;
  clientDone: boolean;
  review: ReviewState;
  offline: OfflineState | null;
  data: Partial<JourneyData>;
}
