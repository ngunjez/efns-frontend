'use client';

import { useState } from 'react';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStaffSignIn, useVerifyStaffCode } from '@/api/hooks/use-auth';
import { queryKeys } from '@/api/query-keys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/FormField';
import { OtpInput } from '@/components/common/OtpInput';
import { AuthCard } from '@/components/layout/staff/AuthCard';
import { homeForPermissions } from '@/config/navigation';
import { safeRedirect } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { signedIn } from '@/store/slices/auth-slice';

const schema = z.object({
  email: z.email('Enter your work email'),
  password: z.string().min(1, 'Enter your password'),
});

export function StaffSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const signIn = useStaffSignIn();
  const verify = useVerifyStaffCode();
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  const { errors } = form.formState;

  if (challengeId) {
    return (
      <AuthCard
        title="Enter your code"
        description="Open the authenticator app on your phone and type the 6-digit code."
      >
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            verify.mutate(
              { challengeId, code },
              {
                onSuccess: (user) => {
                  dispatch(signedIn(user));
                  queryClient.setQueryData(queryKeys.me, user);
                  const next = params.get('next');
                  router.replace(safeRedirect(next, homeForPermissions(user.permissions)) as Route);
                },
                onError: (error) => {
                  if (error.code === 'OUTSIDE_HUB') router.replace('/staff/outside-hub');
                },
              },
            );
          }}
        >
          <div className="grid gap-2">
            <OtpInput
              label="Authenticator code"
              value={code}
              onChange={setCode}
              invalid={verify.isError}
              focusOnMount
            />
            {verify.isError && verify.error.code !== 'OUTSIDE_HUB' && (
              <p role="alert" className="text-sm text-destructive-foreground">
                {verify.error.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={code.length !== 6} loading={verify.isPending}>
            Verify and sign in
          </Button>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Sign in" description="One account for every system your role can open.">
      <form
        noValidate
        className="grid gap-5"
        onSubmit={form.handleSubmit((values) =>
          signIn.mutate(values, { onSuccess: (result) => setChallengeId(result.challengeId) }),
        )}
      >
        {signIn.isError && (
          <p
            role="alert"
            className="rounded-control bg-destructive-tint p-3 text-sm text-destructive-foreground"
          >
            {signIn.error.message}
          </p>
        )}
        <FormField label="Work email" required error={errors.email?.message}>
          {(control) => (
            <Input {...control} type="email" autoComplete="username" {...form.register('email')} />
          )}
        </FormField>
        <FormField label="Password" required error={errors.password?.message}>
          {(control) => (
            <Input
              {...control}
              type="password"
              autoComplete="current-password"
              {...form.register('password')}
            />
          )}
        </FormField>
        <Button type="submit" loading={signIn.isPending}>
          Continue
        </Button>
        <p className="text-xs text-muted-foreground">
          Forgot your password? Your Hub Manager can reset it.
        </p>
      </form>
    </AuthCard>
  );
}
