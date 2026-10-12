'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, LogOut } from 'lucide-react';
import { useSignOut } from '@/api/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { appsForPermissions, homeForPermissions, type AppKey } from '@/config/navigation';
import { site } from '@/config/site';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signedOut } from '@/store/slices/auth-slice';

const appNames: Record<AppKey, string> = { desk: site.deskName, admin: site.adminName };

export function UserMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const signOut = useSignOut();
  if (!user) return null;

  const subtitle = [user.roleLabel, user.station].filter(Boolean).join(', ');
  const current: AppKey = pathname.startsWith('/admin') ? 'admin' : 'desk';
  const others = appsForPermissions(user.permissions).filter((app) => app !== current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-control p-1 text-start hover:bg-muted">
        <Avatar name={user.name} />
        <span className="hidden leading-tight md:grid">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </span>
        <span className="sr-only">Account menu for {user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="normal-case">{user.hub?.name ?? 'Network'}</DropdownMenuLabel>
        {others.map((app) => (
          <DropdownMenuItem key={app} asChild>
            <Link href={homeForPermissions(user.permissions, app)}>
              <ArrowLeftRight aria-hidden /> Open {appNames[app]}
            </Link>
          </DropdownMenuItem>
        ))}
        {others.length > 0 && <DropdownMenuSeparator />}
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
