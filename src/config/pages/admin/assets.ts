import type { PageDefinition } from '@/components/features/register-page';
import { options } from '../shared';

export const procurementPage: PageDefinition = {
  key: 'procurement',
  title: 'Procurement',
  description: 'Purchase requests from request and quotes to approval, order and delivery.',
  createLabel: 'Add purchase request',
  customizable: true,
  form: {
    title: 'Add purchase request',
    description: 'Requests above KES 500,000 need three quotes and a second approval.',
    submitLabel: 'Submit request',
    successMessage: 'Request submitted for approval.',
    sections: [
      {
        title: 'Request',
        fields: [
          {
            name: 'item',
            label: 'Item',
            type: 'select',
            required: true,
            span: 1,
            options: options(
              'Queue display screens',
              'Biometric capture kits',
              'Document scanners',
              'Receipt printers',
              'Backup power units',
            ),
          },
          { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1, span: 1 },
          { name: 'for', label: 'For', type: 'text', required: true, span: 1 },
          { name: 'neededBy', label: 'Needed by', type: 'date', required: true, span: 1 },
          { name: 'reason', label: 'Reason', type: 'textarea' },
        ],
      },
      {
        title: 'Approval',
        fields: [
          { name: 'budgetLine', label: 'Budget line', type: 'text', required: true, span: 1 },
          {
            name: 'approver',
            label: 'Approver',
            type: 'select',
            required: true,
            span: 1,
            options: options('Finance Director', 'Operations Manager'),
          },
          {
            name: 'addToRegister',
            label: 'Add to the equipment register on delivery',
            type: 'switch',
            help: 'Creates tagged assets when the goods are received.',
            defaultValue: true,
          },
        ],
      },
    ],
  },
  rows: [
    { main: [{ type: 'tiles', id: 'pipeline' }] },
    {
      main: [
        {
          type: 'table',
          title: 'Purchase requests',
          searchPlaceholder: 'Search requests',
          selectable: true,
          rowActions: [
            { action: 'approve', label: 'Approve' },
            { action: 'edit', label: 'Edit' },
          ],
          columns: [
            { key: 'request', header: 'Request', kind: 'entity', subKey: 'item', icon: 'package' },
            { key: 'quantity', header: 'Qty', kind: 'number', hideBelow: 'sm' },
            { key: 'supplier', header: 'Supplier', hideBelow: 'md' },
            { key: 'value', header: 'Value', kind: 'money' },
            { key: 'requestedBy', header: 'Requested by', hideBelow: 'lg' },
            { key: 'date', header: 'Date', kind: 'date', hideBelow: 'md' },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
    },
  ],
};
