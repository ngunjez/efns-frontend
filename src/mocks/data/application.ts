import type { ApplicationSummary } from '@/types/domain';

export const application: ApplicationSummary = {
  reference: 'AAS-2026-004812',
  service: 'eFNS Work Permit',
  clientName: 'Priya Raman',
  stage: 10,
  status: { label: 'Under review', tone: 'info' },
  timeline: [
    { label: 'Submitted to eFNS', date: '2 Oct', state: 'done' },
    { label: 'Received by Immigration', date: '5 Oct', state: 'done' },
    { label: 'Under review', date: 'Since 6 Oct', state: 'current' },
    { label: 'Decision', state: 'upcoming' },
    { label: 'Permit sent to the hub', state: 'upcoming' },
    { label: 'Ready to collect', state: 'upcoming' },
  ],
  documentRequest: null,
  passport: 'Safe in the hub vault, receipt LDG-2026-0391.',
  readyToCollect: null,
  hubSupport: { phone: '0800 720 100', email: 'support@nairobicbd.aaas.example' },
};

export const applicationWithRequest: ApplicationSummary = {
  ...application,
  documentRequest: {
    title: 'Professional registration certificate',
    detail:
      'A certified copy showing you are registered to practise as a data professional, or a letter from your employer saying registration does not apply.',
    dueBy: '20 Oct',
  },
};

export const applicationReady: ApplicationSummary = {
  ...application,
  stage: 11,
  status: { label: 'Ready to collect', tone: 'success' },
  timeline: application.timeline.map((step) => ({ ...step, state: 'done' })),
  readyToCollect: {
    hub: 'Nairobi CBD Hub',
    output: 'work permit',
    rows: [
      { label: 'Permit', value: 'Class D, approved 27 October 2026' },
      { label: 'Checked against your application', value: 'Name, passport number and class match' },
      { label: 'Open', value: 'Mon to Fri 8:00 to 17:00, Sat 9:00 to 13:00' },
      { label: 'Appointment', value: 'Not needed' },
      { label: 'Who can collect', value: 'Only you, in person' },
    ],
    bring: ['Lodgement receipt LDG-2026-0391', 'Acknowledgement slip'],
  },
};
