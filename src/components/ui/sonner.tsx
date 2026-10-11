'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from 'next-themes';

/** Global toast host. Fire toasts anywhere with `toast.success()` / `toast.error()` from 'sonner'. */
function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as ToasterProps['theme']) ?? 'light'}
      position="top-right"
      richColors
      closeButton
      toastOptions={{ classNames: { toast: 'rounded-card font-sans' } }}
      {...props}
    />
  );
}

export { Toaster };
