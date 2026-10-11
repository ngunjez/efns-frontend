import type { PageDefinition } from '@/components/features/register-page';
import { hubColumn } from '../shared';

/** Frame 57: how each hub compares on volume, speed, quality and client rating. */
export const performancePage: PageDefinition = {
  key: 'hub-performance',
  title: 'Hub performance',
  description: 'How each hub compares on volume, speed, quality and client rating.',
  customizable: true,
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

/** Frame 106: ratings and complaints across hubs. Complaints open a quality investigation. */
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
