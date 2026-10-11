import { z } from 'zod';

/**
 * Public runtime configuration, validated once at start-up so a missing or
 * malformed variable fails loudly instead of producing silent 404s.
 * Each variable is referenced literally so Next.js can inline it.
 */
const schema = z.object({
  apiBaseUrl: z.url(),
  apiTimeoutMs: z.coerce.number().int().positive().default(15000),
  useMocks: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  idleLockMinutes: z.coerce.number().positive().default(15),
});

export const env = schema.parse({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  apiTimeoutMs: process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
  useMocks: process.env.NEXT_PUBLIC_USE_MSW,
  idleLockMinutes: process.env.NEXT_PUBLIC_IDLE_LOCK_MINUTES,
});
