import type { PageDefinition } from '@/components/features/register-page';

export const journeyBoardPage: PageDefinition = {
  key: 'journey-board',
  title: 'Journey Board',
  description:
    'Every case in the hub today: the stage it is at and who holds it now. Read only, the same for every Service Desk role.',
  pageSize: 15,
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Cases in the hub',
          searchPlaceholder: 'Search tickets or cases',
          columns: [
            { key: 'ticket', header: 'Ticket', kind: 'strong' },
            { key: 'case', header: 'Case', kind: 'muted', hideBelow: 'sm' },
            { key: 'service', header: 'Service', hideBelow: 'md' },
            { key: 'stage', header: 'Stage' },
            { key: 'with', header: 'With', hideBelow: 'lg' },
            { key: 'inStage', header: 'In stage', hideBelow: 'sm' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: {
                on_time: 'success',
                near_sla: 'warning',
                over_sla: 'danger',
                returned: 'warning',
                waiting: 'neutral',
              },
              labels: { on_time: 'On time', near_sla: 'Near SLA', over_sla: 'Over SLA' },
            },
          ],
        },
      ],
    },
  ],
};
