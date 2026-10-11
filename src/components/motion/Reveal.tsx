'use client';

import * as m from 'motion/react-m';
import type { HTMLMotionProps } from 'motion/react';

const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  inView?: boolean;
};

export function Reveal({ delay = 0, inView = false, transition, ...props }: RevealProps) {
  const trigger = inView
    ? { whileInView: 'visible', viewport: { once: true, margin: '-60px' } }
    : { animate: 'visible' };
  return (
    <m.div
      initial="hidden"
      variants={variants}
      transition={{ delay, ...transition }}
      {...trigger}
      {...props}
    />
  );
}
