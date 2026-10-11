'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useSignOut } from '@/api/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signedOut } from '@/store/slices/auth-slice';

export function UserMenu({ compact }: { compact?: boolean }) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const signOut = useSignOut();
  if (!user) return null;

  const subtitle = [user.roleLabel, user.station].filter(Boolean).join(', ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-control p-1 text-left hover:bg-muted">
        <Avatar name={user.name} />
        {!compact && (
          <span className="hidden leading-tight md:grid">
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          </span>
        )}
        <span className="sr-only">Account menu for {user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="normal-case">{user.hub?.name ?? 'Network'}</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() =>
            signOut.mutate(undefined, {
              onSettled: () => {
                dispatch(signedOut());
                queryClient.clear();
                router.replace('/staff/sign-in');
              },
            })
          }
        >
          <LogOut aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
