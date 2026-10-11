'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUnlock } from '@/api/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/FormField';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signedOut, unlocked } from '@/store/slices/auth-slice';
import { env } from '@/config/env';
import { AuthCard } from './AuthCard';

export function LockScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const unlock = useUnlock();
  const [password, setPassword] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => passwordRef.current?.focus(), []);

  if (!user) return null;

  return (
    <AuthCard
      title="Session locked"
      description={`No activity for ${env.idleLockMinutes} minutes. Client details are hidden and your work is saved.`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={user.name} />
        <span className="grid leading-tight">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs text-muted-foreground">
            {[user.roleLabel, user.station].filter(Boolean).join(', ')}
          </span>
        </span>
      </div>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          unlock.mutate(password, { onSuccess: () => dispatch(unlocked()) });
        }}
      >
        <FormField
          label="Password"
          required
          error={unlock.isError ? unlock.error.message : undefined}
        >
          {(control) => (
            <Input
              {...control}
              ref={passwordRef}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          )}
        </FormField>
        <Button type="submit" loading={unlock.isPending} disabled={!password}>
          Unlock
        </Button>
        <Button
          variant="link"
          className="justify-self-center"
          onClick={() => {
            dispatch(signedOut());
            router.replace('/staff/sign-in');
          }}
        >
          Sign in as someone else
        </Button>
      </form>
    </AuthCard>
  );
}
