'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { HTMLMotionProps } from 'motion/react';

export function LiveList({
  children,
  ...props
}: Omit<HTMLMotionProps<'ul'>, 'children'> & { children: React.ReactNode }) {
  return (
    <m.ul layout {...props}>
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </m.ul>
  );
}

export function LiveItem(props: HTMLMotionProps<'li'>) {
  return (
    <m.li
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      {...props}
    />
  );
}
