import { z } from 'zod';

const apiConfigured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);

const schema = z.object({
  apiBaseUrl: z.url().default('http://localhost:4000/api/v1'),
  apiTimeoutMs: z.coerce.number().int().positive().default(15000),
  useMocks: z
    .enum(['true', 'false'])
    .default(apiConfigured ? 'false' : 'true')
    .transform((value) => value === 'true'),
  idleLockMinutes: z.coerce.number().positive().default(15),
});

export const env = schema.parse({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  apiTimeoutMs: process.env.NEXT_PUBLIC_API_TIMEOUT_MS || undefined,
  useMocks: process.env.NEXT_PUBLIC_USE_MSW || undefined,
  idleLockMinutes: process.env.NEXT_PUBLIC_IDLE_LOCK_MINUTES || undefined,
});
