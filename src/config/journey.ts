import type { StageNumber } from '@/types/domain';
import type { JourneyStep } from '@/types/journey';

export const journeySteps: Record<
  JourneyStep,
  { stage: StageNumber; next: JourneyStep | null; showClient: boolean }
> = {
  welcome: { stage: 1, next: 'visit-logged', showClient: false },
  'visit-logged': { stage: 1, next: 'documents', showClient: true },
  documents: { stage: 2, next: 'ticket', showClient: true },
  ticket: { stage: 3, next: 'check-details', showClient: true },
  'check-details': { stage: 4, next: 'consent', showClient: true },
  consent: { stage: 4, next: 'documents-captured', showClient: true },
  'documents-captured': { stage: 5, next: 'biometrics', showClient: true },
  biometrics: { stage: 6, next: 'payment', showClient: true },
  payment: { stage: 7, next: 'payment-confirmed', showClient: true },
  'payment-confirmed': { stage: 7, next: 'lodgement', showClient: true },
  lodgement: { stage: 8, next: 'submitted', showClient: true },
  submitted: { stage: 9, next: null, showClient: true },
  collection: { stage: 11, next: 'feedback', showClient: true },
  feedback: { stage: 12, next: null, showClient: true },
};
