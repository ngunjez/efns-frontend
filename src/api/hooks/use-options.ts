import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../endpoints';
import { queryKeys } from '../query-keys';
import { request } from '../request';
import type { FieldOption, OptionsSource } from '@/components/common/dynamic-form/types';
import type { Hub, Service } from '@/types/domain';
import type { RegisterResponse } from '@/types/register';

const sources: Record<
  OptionsSource,
  { key: readonly unknown[]; load: () => Promise<FieldOption[]> }
> = {
  hubs: {
    key: queryKeys.catalogue.hubs,
    load: () =>
      request
        .get<Hub[]>(ENDPOINTS.catalogue.hubs)
        .then((hubs) => hubs.map((hub) => ({ value: hub.id, label: hub.name }))),
  },
  services: {
    key: queryKeys.catalogue.services,
    load: () =>
      request
        .get<Service[]>(ENDPOINTS.catalogue.services)
        .then((services) =>
          services.map((service) => ({ value: service.id, label: service.name })),
        ),
  },
  roles: {
    key: ['options', 'roles'],
    load: () =>
      request
        .get<RegisterResponse>(ENDPOINTS.registers('roles').list, { pageSize: 100 })
        .then((response) =>
          response.data.map((role) => ({ value: role.id, label: String(role.name) })),
        ),
  },
};

/** Options for a select whose list lives in the API (hubs, services, roles). */
export function useOptionsSource(source?: OptionsSource) {
  const config = source ? sources[source] : undefined;
  return useQuery({
    queryKey: [...(config?.key ?? ['options', 'none']), 'as-options'],
    queryFn: () => config!.load(),
    enabled: Boolean(config),
    staleTime: 10 * 60_000,
  });
}
