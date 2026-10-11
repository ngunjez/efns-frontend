'use client';

import { useState, type ReactNode } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { makeStore, type AppStore } from '@/store';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { MockGate } from './MockGate';
import { SessionErrorRedirect } from './SessionErrorRedirect';

function makeQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (count, error) => (error.status >= 500 || error.status === 0 ? count < 2 : false),
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data !== undefined) toast.error(error.message);
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        const { successMessage, invalidates } = mutation.meta ?? {};
        if (successMessage) toast.success(successMessage);
        invalidates?.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      },
      onError: (error, _variables, _context, mutation) => {
        if (!mutation.meta?.silentError) toast.error(error.message);
      },
    }),
  });
  return queryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  const [store] = useState<AppStore>(makeStore);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <SessionErrorRedirect />
            <MockGate>{children}</MockGate>
            <Toaster />
          </MotionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
