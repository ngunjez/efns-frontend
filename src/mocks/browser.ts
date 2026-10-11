import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

let starting: Promise<unknown> | null = null;

/**
 * Starts the mock API in the browser. Only imported when NEXT_PUBLIC_USE_MSW=true.
 * Idempotent: Strict Mode runs effects twice in development.
 */
export function startMocks() {
  starting ??= setupWorker(...handlers).start({ onUnhandledFrame: 'bypass', quiet: true });
  return starting;
}
