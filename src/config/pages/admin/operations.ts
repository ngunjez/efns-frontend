import type { PageDefinition } from '@/components/features/register-page';
import { options } from '../shared';

export const vaultPage: PageDefinition = {
  key: 'vault',
  title: 'Vault and custody',
  description: 'Every surrendered passport and output held at the hub, by shelf and custodian.',
  createLabel: 'Add stock-take',
  customizable: true,
  form: {
    title: 'Add stock-take',
    description:
      'Record a cycle count. Any difference opens an exception that needs two approvers.',
    submitLabel: 'Save stock-take',
    successMessage: 'Stock-take recorded.',
    sections: [
      {
        fields: [
          {
            name: 'shelf',
            label: 'Shelf',
            type: 'select',
            required: true,
            span: 1,
            options: options(
              'Vault A, Shelf 1',
              'Vault A, Shelf 2',
              'Vault A, Shelf 3',
              'Vault A, Shelf 4',
              'Vault B, Shelf 1',
              'Vault B, Shelf 2',
            ),
          },
          {
            name: 'expected',
            label: 'Items expected',
            type: 'number',
            required: true,
            min: 0,
            span: 1,
          },
          {
            name: 'counted',
            label: 'Items counted',
            type: 'number',
            required: true,
            min: 0,
            span: 1,
          },
          { name: 'countedBy', label: 'Counted by', type: 'text', required: true, span: 1 },
          {
            name: 'variance',
            label: 'Variance explanation',
            type: 'textarea',
            help: 'Required when the counts differ.',
          },
        ],
      },
    ],
  },
  rows: [
    {
      main: [{ type: 'meters', id: 'capacity', title: 'Shelf capacity' }],
      aside: [{ type: 'list', id: 'overdue', title: 'Overdue items' }],
    },
    {
      main: [
        {
          type: 'table',
          title: 'Custody register',
          searchPlaceholder: 'Search passport, holder or register entry',
          selectable: true,
          rowActions: [
            {
              action: 'release',
              label: 'Release',
              form: {
                title: 'Requester and custodian must both sign',
                description:
                  'Releasing an item needs the officer asking for it and the vault custodian. Both sign-offs are written to the register.',
                submitLabel: 'Verify and open vault',
                successMessage: 'Released and recorded in the register.',
                sections: [
                  {
                    title: 'Custodian sign-off',
                    fields: [
                      {
                        name: 'staffNumber',
                        label: 'Staff number',
                        type: 'text',
                        required: true,
                        span: 1,
                      },
                      {
                        name: 'code',
                        label: 'One-time code',
                        type: 'text',
                        required: true,
                        span: 1,
                        help: '6 digits from the authenticator. The custodian cannot also be the requester.',
                      },
                      {
                        name: 'movement',
                        label: 'Movement',
                        type: 'select',
                        required: true,
                        options: options(
                          'Release to client',
                          'Out to courier',
                          'Out to service point',
                        ),
                      },
                    ],
                  },
                ],
              },
            },
            { action: 'move', label: 'Move shelf' },
          ],
          columns: [
            {
              key: 'item',
              header: 'Item',
              kind: 'entity',
              subKey: 'itemType',
              icon: 'lock',
              toneKey: 'tone',
            },
            { key: 'holder', header: 'Holder', hideBelow: 'md' },
            { key: 'application', header: 'Application', kind: 'muted', hideBelow: 'lg' },
            { key: 'location', header: 'Location', hideBelow: 'sm' },
            { key: 'lodged', header: 'Lodged', kind: 'datetime', hideBelow: 'lg' },
            { key: 'custodian', header: 'Custodian', hideBelow: 'lg' },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
    },
  ],
};

export const logisticsPage: PageDefinition = {
  key: 'manifests',
  title: 'Courier and logistics',
  description:
    'Build a consignment for Immigration, seal it, hand it to the runner against a signature and confirm delivery.',
  createLabel: 'Add manifest',
  customizable: true,
  form: {
    title: 'Add manifest',
    submitLabel: 'Create manifest',
    successMessage: 'Manifest created. Scan items into the bag.',
    sections: [
      {
        fields: [
          {
            name: 'destination',
            label: 'Destination',
            type: 'select',
            required: true,
            options: options(
              'Directorate of Immigration, Nyayo House',
              'National Registration Bureau',
              'Another hub',
              'Corporate client',
            ),
          },
          {
            name: 'courier',
            label: 'Courier',
            type: 'select',
            required: true,
            span: 1,
            options: options('G4S Courier', 'Wells Fargo', 'Hub runner'),
          },
          { name: 'seal', label: 'Tamper-evident seal', type: 'text', required: true, span: 1 },
        ],
      },
    ],
  },
  rows: [
    { main: [{ type: 'custom', id: 'scan', component: 'manifest-scan' }] },
    {
      main: [
        {
          type: 'table',
          title: 'Manifests',
          searchPlaceholder: 'Search manifests',
          selectable: true,
          rowActions: [
            { action: 'confirm-delivery', label: 'Confirm delivery' },
            { action: 'report-exception', label: 'Report exception', destructive: true },
          ],
          columns: [
            {
              key: 'manifest',
              header: 'Manifest',
              kind: 'entity',
              subKey: 'items',
              icon: 'truck',
              toneKey: 'tone',
            },
            { key: 'destination', header: 'Destination', hideBelow: 'md' },
            { key: 'courier', header: 'Courier', hideBelow: 'lg' },
            { key: 'dispatched', header: 'Dispatched', kind: 'datetime', hideBelow: 'sm' },
            { key: 'delivered', header: 'Delivered', hideBelow: 'lg' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: {
                delivered: 'success',
                in_transit: 'warning',
                exception: 'danger',
                packing: 'info',
              },
              labels: { in_transit: 'In transit' },
            },
          ],
        },
      ],
    },
  ],
};
