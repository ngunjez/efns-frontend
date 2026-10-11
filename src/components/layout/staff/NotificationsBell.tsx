'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/api/hooks/use-desk';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EmptyState } from '@/components/common/QueryState';
import { cn } from '@/lib/utils';
import { LiveItem, LiveList } from '@/components/motion/LiveList';

const dot = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  neutral: 'bg-muted-foreground',
} as const;

export function NotificationsBell() {
  const { data = [] } = useNotifications();
  const unread = data.filter((item) => !item.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        >
          <Bell />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-2rem))] p-0">
        <p className="border-b px-4 py-3 font-semibold">Notifications</p>
        {data.length === 0 ? (
          <EmptyState title="You're all caught up" className="py-8" />
        ) : (
          <LiveList className="max-h-96 divide-y overflow-y-auto">
            {data.map((item) => {
              const body = (
                <span className="flex gap-3 px-4 py-3">
                  <span
                    aria-hidden
                    className={cn('mt-1.5 size-2 shrink-0 rounded-full', dot[item.tone])}
                  />
                  <span className="grid flex-1 gap-0.5">
                    <span className={cn('text-sm', !item.read && 'font-semibold')}>
                      {item.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.body}</span>
                  </span>
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    {item.time}
                  </span>
                </span>
              );
              return (
                <LiveItem key={item.id}>
                  {item.href ? (
                    <Link href={item.href as Route} className="block hover:bg-muted">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </LiveItem>
              );
            })}
          </LiveList>
        )}
      </PopoverContent>
    </Popover>
  );
}
