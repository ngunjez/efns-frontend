'use client';

import * as m from 'motion/react-m';
import type { HTMLMotionProps } from 'motion/react';

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function StaggerList({
  inView = false,
  ordered = false,
  ...props
}: HTMLMotionProps<'ul'> & { inView?: boolean; ordered?: boolean }) {
  const trigger = inView
    ? { whileInView: 'visible', viewport: { once: true, margin: '-60px' } }
    : { animate: 'visible' };
  const List = ordered ? m.ol : m.ul;
  return (
    <List initial="hidden" variants={list} {...trigger} {...(props as HTMLMotionProps<'ol'>)} />
  );
}

export function StaggerItem(props: HTMLMotionProps<'li'>) {
  return <m.li variants={item} {...props} />;
}
