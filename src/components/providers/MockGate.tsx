'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { env } from '@/config/env';

const MockWorker = dynamic(() => import('./MockWorker'), { ssr: false });

export function MockGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!env.useMocks);
  return (
    <>
      {!ready && <MockWorker onReady={() => setReady(true)} />}
      {ready ? children : null}
    </>
  );
}
