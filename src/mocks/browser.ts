import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

let starting: Promise<unknown> | null = null;

export function startMocks() {
  starting ??= setupWorker(...handlers).start({ onUnhandledFrame: 'bypass', quiet: true });
  return starting;
}
