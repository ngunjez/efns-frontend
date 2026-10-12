import type { PageDefinition } from '@/components/features/register-page';
import { hubColumn, options } from '../shared';

export const performancePage: PageDefinition = {
  key: 'hub-performance',
  title: 'Hub performance',
  description: 'How each hub compares on volume, speed, quality and client rating.',
  customizable: true,
  createLabel: 'Add report',
  form: {
    title: 'Add report',
    description:
      'Schedule a report. It is generated from the same data as this page and sent to the people you choose.',
    submitLabel: 'Save report',
    successMessage: 'Report scheduled.',
    sections: [
      {
        fields: [
          { name: 'name', label: 'Report name', type: 'text', required: true },
          {
            name: 'metrics',
            label: 'Measures',
            type: 'multiselect',
            required: true,
            options: options(
              'Cases',
              'Wait time',
              'SLA met',
              'First-time pass',
              'Rating',
              'Revenue',
            ),
          },
          {
            name: 'hubs',
            label: 'Hubs',
            type: 'multiselect',
            optionsSource: 'hubs',
            help: 'Leave empty for every hub.',
          },
          {
            name: 'frequency',
            label: 'Frequency',
            type: 'segmented',
            required: true,
            options: options('Daily', 'Weekly', 'Monthly'),
            defaultValue: 'Weekly',
          },
          {
            name: 'format',
            label: 'Format',
            type: 'select',
            required: true,
            span: 1,
            options: options('PDF', 'Excel', 'CSV'),
          },
          {
            name: 'recipients',
            label: 'Send to',
            type: 'text',
            required: true,
            span: 1,
            help: 'Email addresses, separated by commas.',
          },
        ],
      },
    ],
  },
  rows: [
    {
      main: [{ type: 'meters', id: 'slaByHub', title: 'SLA met by hub' }],
      aside: [
        { type: 'donut', id: 'againstTarget', title: 'Hubs against target', caption: 'Hubs' },
      ],
    },
    {
      main: [
        {
          type: 'table',
          title: 'Hub ranking',
          searchPlaceholder: 'Search hubs',
          selectable: true,
          rowActions: [{ action: 'review', label: 'Open a hub review' }],
          columns: [
            hubColumn,
            { key: 'region', header: 'Region', hideBelow: 'lg' },
            { key: 'cases', header: 'Cases', kind: 'number' },
            { key: 'wait', header: 'Wait time', hideBelow: 'md' },
            {
              key: 'slaMet',
              header: 'SLA met',
              kind: 'progress',
              thresholds: { success: 90, warning: 75 },
            },
            { key: 'firstTimePass', header: 'First-time pass', kind: 'percent', hideBelow: 'md' },
            { key: 'rating', header: 'Rating', hideBelow: 'sm' },
            { key: 'trend', header: 'Rank change', kind: 'status', hideBelow: 'lg' },
          ],
        },
      ],
      aside: [{ type: 'list', id: 'attention', title: 'Needs attention' }],
    },
  ],
};

export const feedbackPage: PageDefinition = {
  key: 'feedback',
  title: 'Feedback and complaints',
  description: 'Ratings captured at exit and complaints from every channel, across all hubs.',
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Feedback',
          searchPlaceholder: 'Search feedback',
          selectable: true,
          rowActions: [
            { action: 'investigate', label: 'Open an investigation' },
            { action: 'resolve', label: 'Mark resolved' },
          ],
          columns: [
            { key: 'reference', header: 'Reference', kind: 'strong', subKey: 'channel' },
            { key: 'client', header: 'Client', hideBelow: 'md' },
            hubColumn,
            { key: 'rating', header: 'Rating' },
            { key: 'comment', header: 'Comment', kind: 'muted', hideBelow: 'lg' },
            { key: 'received', header: 'Received', kind: 'date', hideBelow: 'sm' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { new: 'info', investigating: 'warning', resolved: 'success' },
            },
          ],
        },
      ],
      aside: [{ type: 'donut', id: 'ratings', title: 'Ratings this month', caption: 'Average' }],
    },
  ],
};
