'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { env } from '@/config/env';

// Browser-only: never part of the server bundle, and with the flag off never loaded at all.
const MockWorker = dynamic(() => import('./MockWorker'), { ssr: false });

/**
 * While the backend endpoints are being built, NEXT_PUBLIC_USE_MSW=true makes
 * the mock service worker answer every API call. Rendering waits until the
 * worker is ready so the first requests are not lost.
 */
export function MockGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!env.useMocks);
  return (
    <>
      {!ready && <MockWorker onReady={() => setReady(true)} />}
      {ready ? children : null}
    </>
  );
}
