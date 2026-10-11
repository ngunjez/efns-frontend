import type { PageDefinition } from '@/components/features/register-page';
import { hubColumn, options } from '../shared';

export const reconciliationPage: PageDefinition = {
  key: 'reconciliation',
  title: 'Finance and reconciliation',
  description: 'Fees collected, amounts remitted to authorities and what is still unmatched.',
  rows: [
    {
      main: [
        {
          type: 'bar-chart',
          id: 'monthly',
          title: 'Fees collected per month, KES millions',
          stacked: true,
          series: [
            { key: 'statutory', label: 'Statutory fees', color: 'var(--chart-1)' },
            { key: 'service', label: 'Service charge', color: 'var(--chart-2)' },
          ],
        },
      ],
      aside: [{ type: 'donut', id: 'channels', title: 'Collected by channel', caption: 'Total' }],
    },
    {
      main: [
        {
          type: 'table',
          title: 'Reconciliation by hub',
          searchPlaceholder: 'Search hubs or receipts',
          selectable: true,
          rowActions: [
            { action: 'reconcile', label: 'Mark reconciled' },
            { action: 'open-dispute', label: 'Open a dispute' },
          ],
          columns: [
            hubColumn,
            { key: 'collected', header: 'Collected', kind: 'money' },
            { key: 'statutory', header: 'Statutory, remitted', kind: 'money', hideBelow: 'lg' },
            { key: 'serviceCharge', header: 'Service charge', kind: 'money', hideBelow: 'lg' },
            { key: 'hubShare', header: 'Hub share', kind: 'money', hideBelow: 'md' },
            { key: 'variance', header: 'Variance', kind: 'money', hideBelow: 'sm' },
            {
              key: 'matched',
              header: 'Matched',
              kind: 'progress',
              thresholds: { success: 99, warning: 90 },
            },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
    },
    { main: [{ type: 'tiles', id: 'unreconciled', title: 'Unreconciled items' }] },
  ],
};

export const allocationPage: PageDefinition = {
  key: 'allocation',
  title: 'Revenue allocation',
  description:
    'How each single client payment is split between the authority, the hub operator and the platform. Internal only: clients see one total.',
  createLabel: 'Add allocation rule',
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Allocation by service',
          searchPlaceholder: 'Search services',
          rowActions: [{ action: 'edit', label: 'Edit split' }],
          columns: [
            { key: 'service', header: 'Service', kind: 'entity', subKey: 'code', icon: 'wallet' },
            { key: 'clientPays', header: 'Client pays', kind: 'money' },
            { key: 'authority', header: 'To the authority', kind: 'money', hideBelow: 'sm' },
            { key: 'hubShare', header: 'Hub operator', kind: 'money', hideBelow: 'md' },
            { key: 'platformShare', header: 'Platform', kind: 'money', hideBelow: 'md' },
            { key: 'effective', header: 'Effective from', kind: 'date', hideBelow: 'lg' },
          ],
        },
      ],
      aside: [
        { type: 'donut', id: 'split', title: 'Where a payment goes', caption: 'Per KES 100' },
      ],
    },
  ],
  form: {
    title: 'Add allocation rule',
    submitLabel: 'Save rule',
    successMessage: 'Allocation saved. It needs a second approval before it applies.',
    sections: [
      {
        fields: [
          {
            name: 'serviceId',
            label: 'Service',
            type: 'select',
            optionsSource: 'services',
            required: true,
          },
          {
            name: 'hubShare',
            label: 'Hub operator share (%)',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
            span: 1,
          },
          {
            name: 'platformShare',
            label: 'Platform share (%)',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
            span: 1,
          },
          { name: 'effective', label: 'Effective from', type: 'date', required: true, span: 1 },
        ],
      },
    ],
  },
};

export const disputesPage: PageDefinition = {
  key: 'disputes',
  title: 'Disputes and refunds',
  description:
    'Payment disputes, SLA breaches owed back to clients and refunds, each resolved and evidenced.',
  createLabel: 'Add dispute',
  form: {
    title: 'Add dispute',
    submitLabel: 'Open dispute',
    successMessage: 'Dispute opened.',
    sections: [
      {
        fields: [
          { name: 'reference', label: 'Payment or case reference', type: 'text', required: true },
          {
            name: 'type',
            label: 'Type',
            type: 'segmented',
            required: true,
            options: options('Payment dispute', 'SLA breach', 'Refund'),
            defaultValue: 'Payment dispute',
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
            name: 'hubId',
            label: 'Hub',
            type: 'select',
            optionsSource: 'hubs',
            required: true,
            span: 1,
          },
          { name: 'detail', label: 'What happened', type: 'textarea', required: true },
        ],
      },
    ],
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Open items',
          searchPlaceholder: 'Search disputes',
          selectable: true,
          rowActions: [
            {
              action: 'refund',
              label: 'Approve refund',
              form: {
                title: 'Approve refund',
                description:
                  'Refunds go back on the channel the client paid with. A second approver signs off above KES 10,000.',
                submitLabel: 'Approve refund',
                successMessage: 'Refund approved.',
                sections: [
                  {
                    fields: [
                      {
                        name: 'amount',
                        label: 'Refund amount (KES)',
                        type: 'number',
                        required: true,
                        min: 1,
                      },
                      { name: 'note', label: 'Note', type: 'textarea', required: true },
                    ],
                  },
                ],
              },
            },
            { action: 'reject', label: 'Reject', destructive: true },
          ],
          columns: [
            { key: 'reference', header: 'Reference', kind: 'strong', subKey: 'type' },
            hubColumn,
            { key: 'amount', header: 'Amount', kind: 'money' },
            { key: 'raised', header: 'Raised', kind: 'date', hideBelow: 'sm' },
            { key: 'owner', header: 'Owner', hideBelow: 'md' },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
    },
  ],
};

export const settlementsPage: PageDefinition = {
  key: 'settlements',
  title: 'Partner settlements',
  description:
    'What is owed to each hub operator from its service charges, settled monthly against a statement.',
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Settlements, September 2026',
          searchPlaceholder: 'Search hubs or statements',
          selectable: true,
          rowActions: [
            { action: 'settle', label: 'Settle now' },
            { action: 'statement', label: 'Send statement' },
          ],
          columns: [
            hubColumn,
            { key: 'statement', header: 'Statement', kind: 'muted', hideBelow: 'md' },
            { key: 'cases', header: 'Cases', kind: 'number', hideBelow: 'sm' },
            { key: 'owed', header: 'Owed', kind: 'money' },
            { key: 'deductions', header: 'Deductions', kind: 'money', hideBelow: 'lg' },
            { key: 'net', header: 'Net payable', kind: 'money' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { settled: 'success', due: 'warning', on_hold: 'danger' },
              labels: { on_hold: 'On hold' },
            },
          ],
        },
      ],
    },
  ],
};
