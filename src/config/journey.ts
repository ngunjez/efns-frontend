import type { StageNumber } from '@/types/domain';
import type { JourneyStep } from '@/types/journey';

interface StepMeta {
  stage: StageNumber;
  next: JourneyStep | null;
  showClient: boolean;
  staffTitle: string;
  clientSees: string;
}

export const journeySteps: Record<JourneyStep, StepMeta> = {
  welcome: {
    stage: 1,
    next: 'visit-logged',
    showClient: false,
    staffTitle: 'Welcome and stream',
    clientSees: 'The streams to choose from',
  },
  'visit-logged': {
    stage: 1,
    next: 'documents',
    showClient: true,
    staffTitle: 'Visit logged',
    clientSees: 'Their visitor pass and the queue to join',
  },
  documents: {
    stage: 2,
    next: 'ticket',
    showClient: true,
    staffTitle: 'Document check',
    clientSees: 'The checklist, ticked as you check each document',
  },
  ticket: {
    stage: 3,
    next: null,
    showClient: true,
    staffTitle: 'Queue ticket',
    clientSees: 'Their ticket number and people ahead',
  },
  'check-details': {
    stage: 4,
    next: 'consent',
    showClient: true,
    staffTitle: 'Check details',
    clientSees: 'Everything you typed, to confirm',
  },
  consent: {
    stage: 4,
    next: 'documents-captured',
    showClient: true,
    staffTitle: 'Consent and signature',
    clientSees: 'The consent note and the signature pad',
  },
  'documents-captured': {
    stage: 5,
    next: 'biometrics',
    showClient: true,
    staffTitle: 'Passport and documents',
    clientSees: 'What was scanned and which originals came back',
  },
  biometrics: {
    stage: 6,
    next: 'payment',
    showClient: true,
    staffTitle: 'Photo and fingerprints',
    clientSees: 'Capture progress and any retake',
  },
  payment: {
    stage: 7,
    next: 'payment-confirmed',
    showClient: true,
    staffTitle: 'Payment',
    clientSees: 'One invoice and how to pay',
  },
  'payment-confirmed': {
    stage: 7,
    next: 'lodgement',
    showClient: true,
    staffTitle: 'Receipt',
    clientSees: 'Their single receipt',
  },
  'provisional-slip': {
    stage: 7,
    next: 'lodgement',
    showClient: true,
    staffTitle: 'Provisional slip',
    clientSees: 'A provisional receipt while the link is down',
  },
  lodgement: {
    stage: 8,
    next: 'submitted',
    showClient: true,
    staffTitle: 'Passport lodgement',
    clientSees: 'The lodgement receipt to sign',
  },
  submitted: {
    stage: 9,
    next: null,
    showClient: true,
    staffTitle: 'Submission',
    clientSees: 'The acknowledgement slip',
  },
  collection: {
    stage: 11,
    next: 'feedback',
    showClient: true,
    staffTitle: 'Collection',
    clientSees: 'The checks, and where to sign for the passport',
  },
  feedback: {
    stage: 12,
    next: null,
    showClient: true,
    staffTitle: 'Exit and rating',
    clientSees: 'The rating screen',
  },
};

export const caseFlows = {
  reception: ['documents', 'ticket'],
  filing: [
    'check-details',
    'consent',
    'documents-captured',
    'biometrics',
    'payment',
    'payment-confirmed',
    'lodgement',
    'submitted',
  ],
  collection: ['collection', 'feedback'],
} as const satisfies Record<string, readonly JourneyStep[]>;

export type CaseFlow = keyof typeof caseFlows;
