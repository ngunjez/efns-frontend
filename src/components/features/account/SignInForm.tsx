'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClientSignIn } from '@/api/hooks/use-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/FormField';
import { PageIntro } from '@/components/common/PageIntro';

/** Frame 91: a returning client signs in with phone or email. */
export function SignInForm() {
  const t = useTranslations('account');
  const router = useRouter();
  const signIn = useClientSignIn();

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

  return (
    <div className="container-narrow grid max-w-lg gap-6 py-section">
      <PageIntro title={t('signInTitle')} body={t('signInBody')} />
      <Card className="p-6">
        <form
          noValidate
          className="grid gap-5"
          onSubmit={form.handleSubmit((values) =>
            signIn.mutate(values, { onSuccess: () => router.push('/my-application') }),
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
        <Link href="/create-account" className="font-semibold text-primary hover:underline">
          {t('create')}
        </Link>
      </p>
    </div>
  );
}
