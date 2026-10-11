'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useClientSignIn } from '@/api/hooks/use-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/FormField';
import { PageIntro } from '@/components/common/PageIntro';
import { Reveal } from '@/components/motion/Reveal';
import { safeRedirect } from '@/lib/utils';

export function SignInForm() {
  const t = useTranslations('account');
  const router = useRouter();
  const params = useSearchParams();
  const signIn = useClientSignIn();
  const next = params.get('next');
  const created = params.get('created') === '1';

  const schema = z.object({
    identifier: z
      .string()
      .trim()
      .min(1, t('required', { field: t('identifier') })),
    password: z.string().min(1, t('required', { field: t('password') })),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '' },
  });
  const { errors } = form.formState;

  const submit = form.handleSubmit((values) =>
    signIn.mutate(values, { onSuccess: () => router.replace(safeRedirect(next, '/') as Route) }),
  );

  return (
    <Reveal className="container-narrow grid max-w-lg gap-6 py-section">
      <PageIntro title={t('signInTitle')} body={t('signInBody')} />
      {created && (
        <p
          role="status"
          className="flex items-start gap-3 rounded-card bg-success-tint p-4 text-sm"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
          <span>
            <strong className="block">{t('createdTitle')}</strong>
            {t('createdBody')}
          </span>
        </p>
      )}
      <Card className="p-6">
        <form noValidate className="grid gap-5" onSubmit={submit}>
          {signIn.isError && (
            <p
              role="alert"
              className="rounded-control bg-destructive-tint p-3 text-sm text-destructive-foreground"
            >
              {signIn.error.message}
            </p>
          )}
          <FormField label={t('identifier')} required error={errors.identifier?.message}>
            {(control) => (
              <Input {...control} autoComplete="username" {...form.register('identifier')} />
            )}
          </FormField>
          <FormField label={t('password')} required error={errors.password?.message}>
            {(control) => (
              <Input
                {...control}
                type="password"
                autoComplete="current-password"
                {...form.register('password')}
              />
            )}
          </FormField>
          <Button type="submit" size="lg" loading={signIn.isPending}>
            {t('signInTitle')}
          </Button>
        </form>
      </Card>
      <p className="text-center">
        {t('noAccount')}{' '}
        <Link
          href={{ pathname: '/create-account', query: next ? { next } : {} }}
          className="font-semibold text-primary hover:underline"
        >
          {t('create')}
        </Link>
      </p>
    </Reveal>
  );
}
