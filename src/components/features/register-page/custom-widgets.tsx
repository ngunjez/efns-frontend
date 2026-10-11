'use client';

import dynamic from 'next/dynamic';
import { LoadingBlock } from '@/components/common/QueryState';

export const customWidgets = {
  'manifest-scan': dynamic(() => import('@/components/features/logistics/ManifestScan'), {
    loading: () => <LoadingBlock />,
  }),
  'page-fields': dynamic(() => import('@/components/features/settings/PageFields'), {
    loading: () => <LoadingBlock />,
  }),
  'notification-channels': dynamic(
    () => import('@/components/features/settings/NotificationChannels'),
    { loading: () => <LoadingBlock /> },
  ),
};

export type CustomWidgetKey = keyof typeof customWidgets;
