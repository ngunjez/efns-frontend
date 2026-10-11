import type { PageDefinition } from '@/components/features/register-page';
import { MENU_ACTIONS, hubColumn, hubField, options } from '../shared';

/** Frame 01: hub applications moving through due diligence and site inspection. */
export const applicationsPage: PageDefinition = {
  key: 'hub-applications',
  title: 'Applications',
  description: 'New hub applications moving through due diligence and site inspection.',
  createLabel: 'Add application',
  customizable: true,
  form: {
    title: 'Add application',
    description: 'Record a new hub application on behalf of an applicant.',
    submitLabel: 'Save application',
    successMessage: 'Application added. Due diligence starts now.',
    sections: [
      {
        title: 'Proposed hub',
        fields: [
          { name: 'hub', label: 'Proposed hub name', type: 'text', required: true, span: 1 },
          {
            name: 'hubType',
            label: 'Hub type',
            type: 'select',
            required: true,
            span: 1,
            options: options('Full-service centre', 'Satellite desk'),
          },
          { name: 'region', label: 'Region', type: 'text', required: true, span: 1 },
          { name: 'counters', label: 'Counters planned', type: 'number', min: 1, max: 32, span: 1 },
          { name: 'address', label: 'Premises address', type: 'text' },
        ],
      },
      {
        title: 'Applicant',
        fields: [
          { name: 'applicant', label: 'Company', type: 'text', required: true, span: 1 },
          { name: 'contact', label: 'Contact person', type: 'text', required: true, span: 1 },
          { name: 'phone', label: 'Phone', type: 'tel', span: 1 },
          { name: 'email', label: 'Email', type: 'email', span: 1 },
          {
            name: 'services',
            label: 'Services requested',
            type: 'multiselect',
            required: true,
            optionsSource: 'services',
          },
          { name: 'incorporation', label: 'Certificate of incorporation', type: 'file' },
        ],
      },
    ],
  },
  remove: {
    title: 'Withdraw this application?',
    description: '{name} will be withdrawn. The record is kept for audit.',
    successMessage: 'Application withdrawn.',
    nameKey: 'hub',
  },
  rows: [
    { main: [{ type: 'tiles', id: 'pipeline' }] },
    {
      main: [
        {
          type: 'table',
          title: 'Applications',
          searchPlaceholder: 'Search applications',
          selectable: true,
          rowActions: [{ action: 'advance', label: 'Move to next stage' }, ...MENU_ACTIONS],
          columns: [
            { ...hubColumn, header: 'Proposed hub' },
            { key: 'region', header: 'Region', hideBelow: 'md' },
            { key: 'applicant', header: 'Applicant', hideBelow: 'sm' },
            { key: 'hubType', header: 'Hub type', hideBelow: 'lg' },
            {
              key: 'stage',
              header: 'Stage',
              kind: 'status',
              tones: {
                submitted: 'info',
                due_diligence: 'warning',
                site_inspection: 'warning',
                decided: 'success',
                declined: 'danger',
              },
              labels: { due_diligence: 'Due diligence', site_inspection: 'Site inspection' },
            },
          ],
        },
      ],
    },
    {
      main: [
        {
          type: 'tiles',
          id: 'dueDiligence',
          title: 'Due-diligence checks across open applications',
          columns: 4,
        },
      ],
    },
  ],
};

/** Frames 02–03: the accreditation register and the go-live gate. */
export const accreditationPage: PageDefinition = {
  key: 'accreditation',
  title: 'Accreditation',
  description: 'Go-live gate: a hub cannot serve clients until it is accredited.',
  createLabel: 'Add accreditation',
  customizable: true,
  form: {
    title: 'Add accreditation',
    description:
      'Open an accreditation review for a hub. It is issued only when every gate criterion is met.',
    submitLabel: 'Start review',
    successMessage: 'Review started. The hub stays blocked until it passes.',
    sections: [
      {
        title: 'Review',
        fields: [
          hubField,
          {
            name: 'reviewType',
            label: 'Review type',
            type: 'select',
            required: true,
            span: 1,
            options: options('First accreditation', 'Renewal', 'Re-inspection'),
          },
          {
            name: 'level',
            label: 'Accreditation level',
            type: 'select',
            required: true,
            span: 1,
            options: options('Full-service centre', 'Satellite desk'),
          },
          {
            name: 'validFor',
            label: 'Valid for',
            type: 'select',
            required: true,
            span: 1,
            options: options('1 year', '2 years', '3 years'),
          },
          { name: 'targetDate', label: 'Target go-live date', type: 'date', span: 1 },
          { name: 'reviewer', label: 'Reviewer', type: 'text', required: true, span: 1 },
        ],
      },
      {
        title: 'Gate criteria',
        fields: [
          {
            name: 'criteria',
            label: 'Gate criteria',
            type: 'toggles',
            required: true,
            options: options(
              'Contract signed',
              'Services configured',
              'Equipment allocated',
              'Inspection passed',
              'Officers certified',
            ),
            defaultValue: [
              'Contract signed',
              'Services configured',
              'Equipment allocated',
              'Inspection passed',
              'Officers certified',
            ],
          },
          {
            name: 'blockService',
            label: 'Block service until accredited',
            type: 'switch',
            help: 'Always on. Bookings and queue stay closed.',
            defaultValue: true,
          },
          { name: 'notes', label: 'Notes', type: 'textarea' },
        ],
      },
    ],
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Accreditation register',
          searchPlaceholder: 'Search hubs',
          selectable: true,
          rowActions: [
            { action: 'renew', label: 'Renew' },
            { action: 'suspend', label: 'Suspend hub', destructive: true },
          ],
          columns: [
            { ...hubColumn, subKey: 'certificate' },
            { key: 'issued', header: 'Issued', kind: 'date', hideBelow: 'md' },
            { key: 'expires', header: 'Expires', kind: 'date', hideBelow: 'sm' },
            { key: 'gate', header: 'Go-live gate', kind: 'progress' },
            {
              key: 'service',
              header: 'Service',
              kind: 'status',
              tones: { serving: 'success', blocked: 'danger' },
            },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
      aside: [{ type: 'checklist', id: 'gate', title: 'Go-live gate' }],
    },
  ],
};
