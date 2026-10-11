import '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import type { ApiError } from './api';

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
