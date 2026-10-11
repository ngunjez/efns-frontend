import type { Status } from './domain';

export type FingerState = 'captured' | 'retake' | 'pending';

/** Every client-facing step the hub screens can show, in journey order. */
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
    /** Five fingers per hand, thumb first: captured, retake or pending. */
    left: FingerState[];
    right: FingerState[];
    captured: string;
    photo: Status;
    issue: { title: string; detail: string; finger: string } | null;
    /** Quality scores of the failed attempts once the retake limit is reached (frame 30). */
    attempts: number[] | null;
    lowest: string | null;
    manager: { name: string; role: string };
  };
  invoice: {
    service: string;
    total: number;
    methods: { key: string; label: string; hint: string }[];
    phone: string;
    /** Payment progress, polled from the gateway through the API. */
    state: 'awaiting' | 'verifying' | 'confirmed';
    expiresInSeconds: number;
  };
  receipt: { number: string; rows: { label: string; value: string }[] };
  lodgement: { receipt: string; rows: { label: string; value: string }[] };
  acknowledgement: { reference: string; rows: { label: string; value: string }[] };
  collection: { checks: string[]; rows: { label: string; value: string }[] };
}

export interface CustomerDisplayView {
  hubName: string;
  /** The officer serving the client at this bay. */
  officer: string;
  client: { name: string; reference: string };
  step: JourneyStep;
  data: Partial<JourneyData>;
}
