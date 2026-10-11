import type { PageDefinition } from '@/components/features/register-page';
import { options, serviceField } from '../shared';

export const feesPage: PageDefinition = {
  key: 'fees',
  title: 'Fees and SLAs',
  description: 'Statutory fees, service charges and time targets for every service.',
  createLabel: 'Add fee rule',
  customizable: true,
  form: {
    title: 'Add fee rule',
    description:
      'A statutory fee as gazetted. The client pays one total; this part is locked for government PRN clearing.',
    submitLabel: 'Save fee rule',
    successMessage: 'Fee rule saved. It applies from its effective date.',
    sections: [
      {
        title: 'Statutory fee',
        fields: [
          serviceField,
          {
            name: 'feeLine',
            label: 'Fee line',
            type: 'select',
            required: true,
            span: 1,
            options: options('Statutory government fee', 'Service charge', 'Express surcharge'),
          },
          {
            name: 'amount',
            label: 'Amount (KES)',
            type: 'number',
            required: true,
            min: 0,
            span: 1,
          },
          {
            name: 'authority',
            label: 'Receiving authority',
            type: 'text',
            required: true,
            span: 1,
          },
          {
            name: 'gazette',
            label: 'Gazette notice reference',
            type: 'text',
            required: true,
            span: 1,
          },
          { name: 'effectiveFrom', label: 'Effective from', type: 'date', required: true, span: 1 },
          { name: 'ends', label: 'Ends', type: 'date', span: 1 },
        ],
      },
      {
        title: 'Payment reference verification',
        fields: [
          {
            name: 'channels',
            label: 'Accepted channels',
            type: 'multiselect',
            required: true,
            options: options(
              'M-Pesa prompt',
              'M-Pesa Paybill',
              'e-Citizen or card',
              'Bank reference',
            ),
          },
          {
            name: 'blockUntilConfirmed',
            label: 'Block submission until the reference is confirmed',
            type: 'switch',
            help: 'The application cannot go to the authority without it.',
            defaultValue: true,
          },
          {
            name: 'secondApproval',
            label: 'Needs second approval',
            type: 'switch',
            help: 'Another administrator approves before the rule goes live.',
            defaultValue: true,
          },
        ],
      },
      {
        title: 'SLA',
        fields: [
          {
            name: 'hubTarget',
            label: 'Hub target',
            type: 'select',
            required: true,
            span: 1,
            options: options('Same day', '1 working day', '2 working days'),
          },
          {
            name: 'authorityTarget',
            label: 'Authority target',
            type: 'select',
            required: true,
            span: 1,
            options: options('3 working days', '7 working days', '14 working days'),
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
          title: 'Fee schedule and SLA',
          searchPlaceholder: 'Search services',
          selectable: true,
          rowActions: [{ action: 'edit', label: 'Edit' }],
          columns: [
            { key: 'service', header: 'Service', kind: 'entity', subKey: 'code', icon: 'document' },
            { key: 'statutoryFee', header: 'Statutory fee', kind: 'money' },
            { key: 'serviceCharge', header: 'Service charge', kind: 'money', hideBelow: 'sm' },
            { key: 'total', header: 'Total', kind: 'money', hideBelow: 'md' },
            { key: 'sla', header: 'SLA', hideBelow: 'md' },
            {
              key: 'slaMet',
              header: 'SLA met',
              kind: 'progress',
              thresholds: { success: 90, warning: 80 },
            },
          ],
        },
      ],
    },
    { main: [{ type: 'tiles', id: 'slaByStage', title: 'SLA by stage this month' }] },
  ],
};

export const formsPage: PageDefinition = {
  key: 'forms',
  title: 'Forms and checklists',
  description:
    'Application forms, document checklists and inspection checklists, each a list of fields you can change.',
  createLabel: 'Add form',
  customizable: true,
  form: {
    title: 'Add form',
    submitLabel: 'Create draft',
    successMessage: 'Draft created. Publish it when the fields are ready.',
    sections: [
      {
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          {
            name: 'type',
            label: 'Type',
            type: 'segmented',
            required: true,
            options: options('Application form', 'Document checklist', 'Inspection checklist'),
            defaultValue: 'Application form',
          },
          { ...serviceField, label: 'Used by' },
        ],
      },
    ],
  },
  remove: {
    title: 'Delete this form?',
    description: '{name} will be removed. Applications in flight keep the version they started on.',
    successMessage: 'Form deleted.',
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Forms and checklists',
          searchPlaceholder: 'Search forms',
          selectable: true,
          rowActions: [
            { action: 'publish', label: 'Publish' },
            { action: 'edit', label: 'Edit' },
            { action: 'delete', label: 'Delete', destructive: true },
          ],
          columns: [
            { key: 'name', header: 'Name', kind: 'entity', subKey: 'code', icon: 'checklist' },
            { key: 'type', header: 'Type', hideBelow: 'md' },
            { key: 'usedBy', header: 'Used by', hideBelow: 'lg' },
            { key: 'size', header: 'Size', hideBelow: 'sm' },
            { key: 'version', header: 'Version', hideBelow: 'sm' },
            { key: 'lastEdited', header: 'Last edited', hideBelow: 'lg' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { published: 'success', draft: 'neutral' },
            },
          ],
        },
      ],
      aside: [{ type: 'list', id: 'fields', title: 'Fields' }],
    },
  ],
};
