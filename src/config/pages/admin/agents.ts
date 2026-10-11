import type { PageDefinition } from '@/components/features/register-page';
import { options } from '../shared';

export const certificationPage: PageDefinition = {
  key: 'officer-certification',
  title: 'Officer certification',
  description:
    'Background vetting, centre binding and the services each officer is certified to file. A lapse in any of them removes filing rights.',
  createLabel: 'Add exam',
  customizable: true,
  form: {
    title: 'Add exam',
    description:
      'Schedule a certification exam. It runs in Safe Exam Browser on a hub workstation.',
    submitLabel: 'Schedule exam',
    successMessage: 'Exam scheduled. The officer is notified.',
    sections: [
      {
        fields: [
          { name: 'officer', label: 'Officer', type: 'text', required: true, span: 1 },
          {
            name: 'serviceId',
            label: 'Service',
            type: 'select',
            optionsSource: 'services',
            required: true,
            span: 1,
          },
          { name: 'date', label: 'Exam date', type: 'date', required: true, span: 1 },
          {
            name: 'passMark',
            label: 'Pass mark (%)',
            type: 'number',
            min: 50,
            max: 100,
            defaultValue: 80,
            span: 1,
          },
        ],
      },
    ],
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Officers',
          searchPlaceholder: 'Search officers or services',
          selectable: true,
          rowActions: [
            { action: 'renew-vetting', label: 'Renew vetting' },
            { action: 'revoke', label: 'Revoke filing rights', destructive: true },
          ],
          columns: [
            { key: 'officer', header: 'Officer', kind: 'person', subKey: 'officerId' },
            { key: 'binding', header: 'Centre binding', subKey: 'bindingNote', hideBelow: 'lg' },
            {
              key: 'vetting',
              header: 'Background vetting',
              subKey: 'vettingNote',
              hideBelow: 'md',
            },
            { key: 'certifications', header: 'Service certifications', kind: 'statuses' },
            { key: 'exam', header: 'Exam', hideBelow: 'sm' },
            { key: 'validUntil', header: 'Valid until', kind: 'date', hideBelow: 'md' },
            { key: 'filingRights', header: 'Filing rights', kind: 'status' },
          ],
        },
      ],
      aside: [
        { type: 'list', id: 'revocation', title: 'Automatic revocation', variant: 'timeline' },
      ],
    },
    { main: [{ type: 'tiles', id: 'byService', title: 'Certified officers by service' }] },
  ],
};

export const disciplinePage: PageDefinition = {
  key: 'discipline',
  title: 'Discipline and coaching',
  description:
    'From a coaching plan to a formal investigation, with every step recorded. Investigation notes are visible to HR only.',
  createLabel: 'Add case',
  customizable: true,
  form: {
    title: 'Add case',
    submitLabel: 'Open case',
    successMessage: 'Case opened. The officer and their manager are notified.',
    sections: [
      {
        fields: [
          { name: 'officer', label: 'Officer', type: 'text', required: true, span: 1 },
          {
            name: 'hubId',
            label: 'Hub',
            type: 'select',
            optionsSource: 'hubs',
            required: true,
            span: 1,
          },
          { name: 'trigger', label: 'Trigger', type: 'textarea', required: true },
          {
            name: 'stage',
            label: 'Starting stage',
            type: 'segmented',
            required: true,
            options: options('Coaching plan', 'Formal warning', 'Investigation'),
            defaultValue: 'Coaching plan',
          },
          { name: 'owner', label: 'Owner', type: 'text', required: true, span: 1 },
          { name: 'nextStep', label: 'Next step due', type: 'date', span: 1 },
        ],
      },
    ],
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Cases',
          searchPlaceholder: 'Search cases or officers',
          selectable: true,
          rowActions: [
            { action: 'edit', label: 'Update' },
            { action: 'escalate', label: 'Escalate' },
          ],
          columns: [
            { key: 'case', header: 'Case', kind: 'strong', subKey: 'category' },
            { key: 'officer', header: 'Officer', kind: 'person', subKey: 'officerId' },
            { key: 'hub', header: 'Hub', hideBelow: 'lg' },
            { key: 'trigger', header: 'Trigger', hideBelow: 'md' },
            { key: 'stage', header: 'Stage', hideBelow: 'sm' },
            { key: 'owner', header: 'Owner', hideBelow: 'lg' },
            { key: 'nextStep', header: 'Next step', kind: 'date', hideBelow: 'md' },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
      aside: [{ type: 'list', id: 'escalation', title: 'Escalation path', variant: 'timeline' }],
    },
  ],
};
