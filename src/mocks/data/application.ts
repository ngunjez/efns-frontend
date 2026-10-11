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
  hubSupport: { phone: '0800 720 100', email: 'support@nairobicbd.aaas.example' },
};

/** Frame 39: the same case once Immigration asks for one more document. */
export const applicationWithRequest: ApplicationSummary = {
  ...application,
  documentRequest: {
    title: 'Professional registration certificate',
    detail:
      'A certified copy showing you are registered to practise as a data professional, or a letter from your employer saying registration does not apply.',
    dueBy: '20 Oct',
  },
};
