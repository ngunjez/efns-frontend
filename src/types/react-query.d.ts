import '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import type { ApiError } from './api';

/**
 * Mutation `meta` drives the shared behaviour in src/components/providers:
 * a success toast, cache invalidation, and opting out of the global error toast.
 */
interface MutationMeta extends Record<string, unknown> {
  successMessage?: string;
  invalidates?: QueryKey[];
  silentError?: boolean;
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
    mutationMeta: MutationMeta;
  }
}
