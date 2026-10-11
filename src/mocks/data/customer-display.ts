import type { CustomerDisplayView } from '@/types/journey';

export const customerDisplay: CustomerDisplayView = {
  hubName: 'Nairobi CBD Hub',
  officer: 'Grace Mwangi',
  client: { name: 'Priya Raman', reference: 'AAS-2026-004812' },
  step: 'check-details',
  data: {
    visitPass: {
      number: 'V-0064',
      service: 'Work permit application',
      time: 'Friday 2 October 2026, 09:02',
      checks: ['Bag screened', 'Person screened', 'Passport shown and visit logged'],
      queues: [
        { key: 'efns', label: 'eFNS Work Permit', hint: 'Queue B' },
        { key: 'passport', label: 'Passport', hint: 'Queue A' },
        { key: 'id', label: 'National ID', hint: 'Queue C' },
        { key: 'priority', label: 'Priority assistance', hint: 'Seniors, expectant, disability' },
      ],
    },
    checklist: [
      { label: 'Passport', done: true },
      { label: 'Application form', done: true },
      { label: 'Employer letter', done: true },
      { label: 'Academic certificates', done: true },
      { label: 'Passport photos', done: true },
      { label: 'Previous permit', done: true },
    ],
    missing: null,
    ticket: {
      number: 'B-047',
      queue: 'Queue B, eFNS Work Permit',
      ahead: 3,
      estimate: '12 minutes',
      sms: true,
    },
    details: [
      {
        title: 'About you',
        rows: [
          { label: 'Full name', value: 'Priya Raman' },
          { label: 'Date of birth', value: '14 March 1992' },
          { label: 'Nationality', value: 'Indian' },
          { label: 'Passport number', value: 'Z4418207' },
        ],
      },
      {
        title: 'Your work',
        rows: [
          { label: 'Employer', value: 'Savannah Analytics Ltd' },
          { label: 'Position', value: 'Senior Data Analyst' },
          { label: 'Permit class', value: 'Class D' },
          { label: 'Period asked for', value: '2 years from 1 Nov 2026' },
        ],
      },
      {
        title: 'Contact in Kenya',
        rows: [
          { label: 'Mobile', value: '0745 220 318' },
          { label: 'Email', value: 'priya.raman@mail.example' },
          { label: 'Address', value: 'Kilimani, Nairobi' },
        ],
      },
      {
        title: 'Documents on file',
        rows: [
          { label: 'Checked at reception', value: '6 of 6' },
          { label: 'Previous permit', value: 'Class D, held since 2024' },
        ],
      },
    ],
    consentText:
      'I agree that Nairobi CBD Hub may collect my personal details, documents, photograph and fingerprints, and send them to the Directorate of Immigration Services through eFNS, only to process my work permit application.',
    passport: {
      mrz: [
        'P<INDRAMAN<<PRIYA<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
        'Z4418207<8IND9203147F3108119<<<<<<<<<<<<<<04',
      ],
      rows: [
        { label: 'Name', value: 'RAMAN, PRIYA' },
        { label: 'Number', value: 'Z4418207' },
        { label: 'Expires', value: '11 August 2031' },
        { label: 'Pages read', value: 'Bio-data and 2 endorsements' },
      ],
    },
    documents: [
      { label: 'Application form', status: { label: 'We keep it', tone: 'neutral' } },
      { label: 'Employer letter', status: { label: 'Original returned', tone: 'success' } },
      { label: 'Academic certificates', status: { label: 'Originals returned', tone: 'success' } },
      { label: 'Passport photos', status: { label: 'We keep them', tone: 'neutral' } },
      { label: 'Previous permit', status: { label: 'Original returned', tone: 'success' } },
    ],
    biometrics: {
      left: ['captured', 'captured', 'captured', 'captured', 'captured'],
      right: ['captured', 'retake', 'captured', 'captured', 'captured'],
      captured: '9 of 10 captured',
      photo: { label: 'Photo quality 92, good', tone: 'success' },
      issue: {
        title: 'One fingerprint needs a retake',
        detail:
          'Your right index finger was not clear enough. We take it again now, before you leave the booth.',
        finger: 'Right index finger: quality 38, needs 60 or more',
      },
      attempts: null,
      lowest: null,
      manager: { name: 'Wanjiku Kamau', role: 'Hub Manager, Nairobi CBD Hub' },
    },
    invoice: {
      service: 'eFNS Work Permit, Class D',
      total: 51500,
      methods: [
        { key: 'mpesa', label: 'M-Pesa prompt', hint: 'A request is sent to your phone' },
        { key: 'paybill', label: 'M-Pesa Paybill', hint: 'Pay yourself, then give the code' },
        { key: 'card', label: 'e-Citizen or card', hint: 'Card reader, or scan a code' },
        { key: 'bank', label: 'Corporate bank transfer', hint: 'EFT or bank slip reference' },
      ],
      phone: '0745 220 318',
      state: 'awaiting',
      expiresInSeconds: 48,
    },
    receipt: {
      number: 'RCT-2026-116902',
      rows: [
        { label: 'Paid', value: 'KES 51,500, M-Pesa' },
        { label: 'M-Pesa reference', value: 'SJ29K4LQ7X' },
        { label: 'e-Citizen payment reference', value: 'PRN-2026-55120931' },
        { label: 'Time', value: '2 Oct 2026, 10:14' },
      ],
    },
    lodgement: {
      receipt: 'LDG-2026-0391',
      rows: [
        { label: 'Item', value: 'Passport Z4418207' },
        { label: 'Vault', value: 'Vault A, Shelf 3, Slot 12' },
        { label: 'Lodged by', value: 'Grace Mwangi' },
        { label: 'Custodian', value: 'Samuel Kiprop' },
      ],
    },
    acknowledgement: {
      reference: 'EFNS-2026-0918273',
      rows: [
        { label: 'Application', value: 'AAS-2026-004812' },
        { label: 'Submitted to', value: 'Directorate of Immigration Services, eFNS' },
        { label: 'Usually takes', value: '7 working days' },
        { label: 'Tracking link', value: 'Sent by SMS and email' },
      ],
    },
    collection: {
      checks: [
        'It is you: fingerprint matched',
        'Permit matches your application',
        'Passport Z4418207 released from the vault by two officers',
        'Permit endorsement affixed on page 14',
      ],
      rows: [
        { label: 'Permit number', value: 'WP-D-2026-044187' },
        { label: 'Valid', value: '1 Nov 2026 to 31 Oct 2028' },
        { label: 'Vault register, out', value: 'VR-2026-01477, 29 Oct 2026, 14:09' },
      ],
    },
  },
};
