'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/monitoring';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => reportError(error, { digest: error.digest, scope: 'global' }), [error]);
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
        }}
      >
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1>Something went wrong</h1>
          <p>Please try again. If it keeps happening, call 0800 720 100.</p>
          <button type="button" onClick={reset} style={{ padding: '10px 20px', borderRadius: 12 }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
