/**
 * The one place errors leave the app. Wire Sentry (or the chosen tool) here
 * once its DSN is issued — every caller already routes through this function.
 */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[reportError]', error, context);
  }
}
