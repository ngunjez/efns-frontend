import type { PageDefinition } from '@/components/features/register-page';
import { SEVERITY_TONES, hubColumn, hubField, options } from '../shared';

/** Frame 53: how often cases come back, why, and what rework costs. */
export const qualityPage: PageDefinition = {
  key: 'quality',
  title: 'Quality and rework',
  description: 'How often cases come back, why, and what the rework costs.',
  customizable: true,
  rows: [
    {
      main: [
        {
          type: 'bar-chart',
          id: 'returns',
          title: 'Cases returned per month',
          stacked: true,
          series: [
            { key: 'verification', label: 'Returned at verification', color: 'var(--chart-1)' },
            { key: 'qa', label: 'Returned at QA', color: 'var(--chart-3)' },
          ],
        },
      ],
    },
    {
      main: [
        {
          type: 'table',
          title: 'Rework by hub',
          searchPlaceholder: 'Search hubs',
          selectable: true,
          columns: [
            hubColumn,
            { key: 'cases', header: 'Cases', kind: 'number' },
            { key: 'returned', header: 'Returned', kind: 'number', hideBelow: 'sm' },
            { key: 'returnRate', header: 'Return rate', kind: 'progress' },
            { key: 'topReason', header: 'Top reason', hideBelow: 'md' },
            { key: 'reworkTime', header: 'Rework time', hideBelow: 'lg' },
          ],
        },
      ],
    },
  ],
};

/** Frame 54: root-cause investigation and the plan to closure. */
export const correctiveActionsPage: PageDefinition = {
  key: 'corrective-actions',
  title: 'Corrective actions',
  description:
    'Every non-conformance traced to a cause, with a plan, an owner and an effectiveness check.',
  createLabel: 'Add corrective action',
  customizable: true,
  form: {
    title: 'Add corrective action',
    description: 'Assign a root-cause investigation and track the plan to closure.',
    submitLabel: 'Save corrective action',
    successMessage: 'Corrective action saved. The investigator is notified.',
    sections: [
      {
        title: 'Incident',
        fields: [
          { name: 'source', label: 'Source', type: 'text', required: true, span: 1 },
          hubField,
          {
            name: 'severity',
            label: 'Severity',
            type: 'select',
            required: true,
            span: 1,
            options: [
              { value: 'minor', label: 'Minor' },
              { value: 'major', label: 'Major' },
              { value: 'critical', label: 'Critical' },
            ],
          },
          { name: 'casesAffected', label: 'Cases affected', type: 'text', span: 1 },
        ],
      },
      {
        title: 'Investigation',
        fields: [
          { name: 'investigator', label: 'Investigator', type: 'text', required: true, span: 1 },
          { name: 'reportDue', label: 'Report due', type: 'date', required: true, span: 1 },
          { name: 'rootCause', label: 'Root cause', type: 'textarea' },
          {
            name: 'actionPlan',
            label: 'Action plan',
            type: 'textarea',
            help: 'One action per line, with owner and date.',
          },
        ],
      },
      {
        title: 'People and hub',
        fields: [
          {
            name: 'officerAction',
            label: 'Officer action',
            type: 'select',
            span: 1,
            options: options('None', 'Retraining', 'Coaching plan', 'Formal warning'),
          },
          {
            name: 'warning',
            label: 'Issue a de-accreditation warning',
            type: 'switch',
            help: 'A third warning opens a hub review.',
          },
          { name: 'verifiedBy', label: 'Verified by', type: 'text', required: true, span: 1 },
          { name: 'effectiveness', label: 'Effectiveness check', type: 'text', span: 1 },
        ],
      },
    ],
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Corrective actions',
          searchPlaceholder: 'Search actions',
          selectable: true,
          rowActions: [
            { action: 'edit', label: 'Update' },
            { action: 'close', label: 'Close' },
          ],
          columns: [
            { key: 'reference', header: 'Reference', kind: 'strong', subKey: 'source' },
            hubColumn,
            { key: 'severity', header: 'Severity', kind: 'status', tones: SEVERITY_TONES },
            { key: 'investigator', header: 'Investigator', hideBelow: 'md' },
            { key: 'reportDue', header: 'Report due', kind: 'date', hideBelow: 'sm' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { open: 'warning', in_progress: 'info', closed: 'success' },
              labels: { in_progress: 'In progress' },
            },
          ],
        },
      ],
    },
  ],
};

/** Frame 55: a permanent record of who did what, when and from where. Read only. */
export const auditPage: PageDefinition = {
  key: 'audit',
  title: 'Audit log',
  description: 'A permanent record of who did what, when and from where.',
  pageSize: 12,
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Events',
          searchPlaceholder: 'Search the log',
          columns: [
            { key: 'time', header: 'Time', kind: 'datetime' },
            { key: 'user', header: 'User', kind: 'person' },
            { key: 'action', header: 'Action', kind: 'strong' },
            { key: 'record', header: 'Record', hideBelow: 'md' },
            { key: 'module', header: 'Module', hideBelow: 'lg' },
            { key: 'change', header: 'Change', kind: 'muted', hideBelow: 'lg' },
            { key: 'origin', header: 'Origin', hideBelow: 'lg' },
            {
              key: 'result',
              header: 'Result',
              kind: 'status',
              tones: { success: 'success', blocked: 'danger', flagged: 'warning' },
            },
          ],
        },
      ],
    },
  ],
};

/** Frame 56: every action that needed a second person, who asked and who approved. */
export const exceptionsPage: PageDefinition = {
  key: 'exceptions',
  title: 'Exception ledger',
  description:
    'Every action that needed a second person to approve it, who asked and who approved. Read only.',
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Exceptions',
          searchPlaceholder: 'Search exceptions, cases or officers',
          selectable: true,
          rowActions: [
            {
              action: 'approve',
              label: 'Approve as second sign-off',
              form: {
                title: 'Second sign-off',
                description:
                  'You are the second person approving this exception. It cannot be the person who asked.',
                submitLabel: 'Approve',
                successMessage: 'Exception approved and recorded.',
                sections: [
                  { fields: [{ name: 'note', label: 'Note', type: 'textarea', required: true }] },
                ],
              },
            },
          ],
          columns: [
            {
              key: 'exception',
              header: 'Exception',
              kind: 'entity',
              subKey: 'type',
              icon: 'alert',
              toneKey: 'tone',
            },
            { key: 'case', header: 'Case or item', kind: 'muted', hideBelow: 'md' },
            { key: 'requestedBy', header: 'Requested by', hideBelow: 'sm' },
            { key: 'secondSignOff', header: 'Second sign-off', hideBelow: 'lg' },
            { key: 'reason', header: 'Reason', hideBelow: 'lg' },
            { key: 'time', header: 'Time', kind: 'datetime', hideBelow: 'md' },
            { key: 'status', header: 'Status', kind: 'status' },
          ],
        },
      ],
    },
    { main: [{ type: 'tiles', id: 'byType', title: 'By type, this month' }] },
  ],
};
