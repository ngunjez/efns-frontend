import type { PageDefinition } from '@/components/features/register-page';
import { options } from '../shared';

export const vaultPage: PageDefinition = {
  key: 'vault',
  title: 'Vault and custody',
  description: 'Every surrendered passport and output held at the hub, by shelf and custodian.',
  customizable: true,
  headerActions: [
    {
      action: 'check-in',
      label: 'Check in an item',
      form: {
        title: 'Check in an item',
        description: 'Label the item, place it in its slot and record who handed it over.',
        submitLabel: 'Check in and print label',
        successMessage: 'Checked in. The label is printing and the client has a lodgement receipt.',
        sections: [
          {
            title: 'Item',
            fields: [
              { name: 'application', label: 'Application', type: 'text', required: true, span: 1 },
              {
                name: 'itemType',
                label: 'Item type',
                type: 'select',
                required: true,
                span: 1,
                options: options(
                  'Surrendered passport',
                  'Permit sticker',
                  'Alien card',
                  'Stamped certificate',
                ),
              },
              {
                name: 'documentNumber',
                label: 'Document number',
                type: 'text',
                required: true,
                span: 1,
              },
              { name: 'holder', label: 'Holder', type: 'text', required: true, span: 1 },
            ],
          },
          {
            title: 'Location',
            fields: [
              {
                name: 'shelf',
                label: 'Vault and shelf',
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
                name: 'slot',
                label: 'Slot or box',
                type: 'text',
                required: true,
                span: 1,
                defaultValue: 'Next free slot',
              },
            ],
          },
          {
            title: 'Custody',
            fields: [
              {
                name: 'handedOverBy',
                label: 'Handed over by',
                type: 'text',
                required: true,
                span: 1,
              },
              { name: 'receivedBy', label: 'Received by', type: 'text', required: true, span: 1 },
              {
                name: 'condition',
                label: 'Condition on receipt',
                type: 'textarea',
                defaultValue: 'No defects recorded at capture.',
              },
              {
                name: 'lodgementReceipt',
                label: 'Issue a lodgement receipt to the client',
                type: 'switch',
                defaultValue: true,
              },
              {
                name: 'bothSigned',
                label: 'Both officers have signed',
                type: 'switch',
                help: 'Signatures captured on the pad.',
              },
            ],
          },
        ],
      },
    },
    {
      action: 'stock-take',
      label: 'Add stock-take',
      form: {
        title: 'Stock-take',
        description:
          'Count each shelf against the register. A difference opens an exception that needs two approvers.',
        submitLabel: 'Close stock-take',
        successMessage: 'Stock-take closed. Any variance was sent to the exception ledger.',
        sections: [
          {
            title: 'Count',
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
              { name: 'countedBy', label: 'Counted by', type: 'text', required: true, span: 1 },
              {
                name: 'expected',
                label: 'In the register',
                type: 'number',
                required: true,
                min: 0,
                span: 1,
              },
              {
                name: 'counted',
                label: 'Counted',
                type: 'number',
                required: true,
                min: 0,
                span: 1,
              },
            ],
          },
          {
            title: 'Reconcile',
            fields: [
              {
                name: 'resolution',
                label: 'Resolution',
                type: 'select',
                span: 1,
                options: options(
                  'No variance',
                  'Found, register corrected',
                  'Not found, reported as lost',
                ),
              },
              { name: 'foundAt', label: 'Found at', type: 'text', span: 1 },
              { name: 'whatHappened', label: 'What happened', type: 'textarea' },
              { name: 'approvedBy', label: 'Approved by', type: 'text', span: 1 },
              { name: 'nonConformance', label: 'Raise a non-conformance', type: 'switch' },
              { name: 'bothSigned', label: 'Both custodians have signed', type: 'switch' },
            ],
          },
        ],
      },
    },
  ],
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
