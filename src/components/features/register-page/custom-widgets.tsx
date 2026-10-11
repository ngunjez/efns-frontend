'use client';

import dynamic from 'next/dynamic';
import { LoadingBlock } from '@/components/common/QueryState';

/**
 * Widgets too specific to be data-driven, mounted by key from a page
 * definition. Loaded lazily so each only ships with the page that uses it.
 */
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
