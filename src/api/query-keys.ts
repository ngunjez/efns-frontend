import type { ListParams } from '@/types/api';

/** Query keys in one tree, so invalidation is exact: invalidate a prefix, refresh every view of it. */
export const queryKeys = {
  me: ['auth', 'me'] as const,
  client: {
    me: ['client', 'me'] as const,
    application: ['client', 'application'] as const,
    track: (reference: string) => ['client', 'track', reference] as const,
  },
  catalogue: {
    services: ['catalogue', 'services'] as const,
    hubs: ['catalogue', 'hubs'] as const,
    slots: (serviceId: string, hubId: string, date: string) =>
      ['catalogue', 'slots', serviceId, hubId, date] as const,
  },
  appointments: ['appointments'] as const,
  desk: {
    all: ['desk'] as const,
    hubStatus: ['desk', 'hub-status'] as const,
    station: ['desk', 'station'] as const,
    floorboard: ['desk', 'floorboard'] as const,
    journeyBoard: ['desk', 'journey-board'] as const,
    workbench: ['desk', 'workbench'] as const,
    notifications: ['desk', 'notifications'] as const,
    support: (caseId: string) => ['desk', 'support', caseId] as const,
    floorHost: ['desk', 'floor-host'] as const,
    clientLookup: (query: string) => ['desk', 'client-lookup', query] as const,
  },
  displays: {
    hall: ['displays', 'hall'] as const,
    bay: (bay: string) => ['displays', 'bay', bay] as const,
    customer: ['displays', 'customer'] as const,
  },
  settings: (key: string) => ['settings', key] as const,
  register: {
    all: (key: string) => ['registers', key] as const,
    list: (key: string, params: ListParams) => ['registers', key, params] as const,
  },
  customFields: (page: string) => ['custom-fields', page] as const,
  openManifest: ['logistics', 'open-manifest'] as const,
};
