'use client';

import { useEffect } from 'react';

export default function MockWorker({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    import('@/mocks/browser').then(({ startMocks }) => startMocks()).then(onReady);
  }, [onReady]);
  return null;
}
