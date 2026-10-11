'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterClient, useVerifyPhone } from '@/api/hooks/use-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChoiceCards } from '@/components/common/ChoiceCards';
import { FormField } from '@/components/common/FormField';
import { OtpInput } from '@/components/common/OtpInput';
import { PageIntro } from '@/components/common/PageIntro';
import { StepProgress } from '@/components/common/StepProgress';
import type { ClientCategory } from '@/types/auth';

const STEPS = ['stepCategory', 'stepDetails', 'stepContact'] as const;
const STEP_FIELDS = [
  ['category'],
  ['documentNumber', 'nationality', 'firstName', 'lastName'],
  ['phone', 'email', 'password', 'agree'],
] as const;
const DOCUMENT_LABEL = {
  citizen: 'nationalId',
  resident: 'foreignerCertificate',
  other: 'passportNumber',
} as const;

/**
 * Frames 92–97: category → identity details (by category) → contact → SMS code.
 * One form and one schema across the steps; each step validates only its own fields.
 */
export function CreateAccountWizard() {
  const t = useTranslations('account');
  const common = useTranslations('common');
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [verification, setVerification] = useState<{ id: string; phone: string } | null>(null);
  const [code, setCode] = useState('');
  const register = useRegisterClient();
  const verify = useVerifyPhone();

  const required = (field: Parameters<typeof t>[0]) => t('required', { field: t(field) });
  const schema = z
    .object({
      category: z.enum(['citizen', 'resident', 'other']),
      documentNumber: z
        .string()
        .trim()
        .min(1, t('required', { field: t('nationalId') })),
      nationality: z.string().trim(),
      firstName: z.string().trim().min(1, required('firstName')),
      lastName: z.string().trim().min(1, required('lastName')),
      phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9\s]{9,15}$/, t('invalidPhone')),
      email: z.email(t('invalidEmail')),
      password: z.string().regex(/^(?=.*\d).{8,}$/, t('passwordRule')),
      agree: z.literal(true, { error: t('mustAgree') }),
    })
    .superRefine((values, ctx) => {
      if (values.category !== 'citizen' && !values.nationality) {
        ctx.addIssue({ code: 'custom', path: ['nationality'], message: required('nationality') });
      }
    });
  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      category: 'citizen',
      documentNumber: '',
      nationality: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
    },
  });
  const { errors } = form.formState;
  const category = useWatch({ control: form.control, name: 'category' }) as ClientCategory;

  const next = async () => {
    if (await form.trigger([...(STEP_FIELDS[step] ?? [])] as (keyof Values)[])) setStep(step + 1);
  };

  const submit = form.handleSubmit((values) =>
    register.mutate(values, {
      onSuccess: (result) => setVerification({ id: result.verificationId, phone: values.phone }),
    }),
  );

  const finish = () =>
    verification &&
    verify.mutate(
      { verificationId: verification.id, code },
      {
        onSuccess: () => {
          const service = params.get('service');
          const hub = params.get('hub');
          router.push(
            service ? `/book?service=${service}${hub ? `&hub=${hub}` : ''}` : '/my-application',
          );
        },
      },
    );

  if (verification) {
    return (
      <div className="container-narrow grid max-w-lg gap-6 py-section">
        <PageIntro title={t('verifyTitle')} body={t('verifyBody', { phone: verification.phone })} />
        <Card className="p-6">
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              finish();
            }}
          >
            <div className="grid gap-2">
              <OtpInput
                label={t('code')}
                value={code}
                onChange={setCode}
                invalid={verify.isError}
                focusOnMount
              />
              {verify.isError && (
                <p role="alert" className="text-sm text-destructive-foreground">
                  {verify.error.message}
                </p>
              )}
            </div>
            <Button type="submit" size="lg" disabled={code.length !== 6} loading={verify.isPending}>
              {t('confirm')}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-narrow grid gap-6 py-section">
      <PageIntro
        title={t('title')}
        body={step === 0 ? t('body') : step === 1 ? t('detailsBody') : t('contactBody')}
      />
      <StepProgress
        current={step + 1}
        total={STEPS.length}
        label={t('stepOf', { step: step + 1, name: t(STEPS[step]!) })}
        nextLabel={step < STEPS.length - 1 ? t('next', { name: t(STEPS[step + 1]!) }) : undefined}
        stepNames={STEPS.map((name) => t(name))}
        ariaLabel={t('title')}
      />

      <form noValidate onSubmit={submit} className="grid gap-6">
        <Card className="grid gap-5 p-5 sm:p-6">
          {step === 0 && (
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <ChoiceCards
                  label={t('stepCategory')}
                  value={field.value}
                  onValueChange={field.onChange}
                  choices={[
                    { value: 'citizen', label: t('citizen'), hint: t('citizenHint') },
                    { value: 'resident', label: t('resident'), hint: t('residentHint') },
                    { value: 'other', label: t('other'), hint: t('otherHint') },
                  ]}
                />
              )}
            />
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label={t(DOCUMENT_LABEL[category])}
                required
                error={errors.documentNumber?.message}
                className="sm:col-span-2"
              >
                {(control) => (
                  <Input {...control} autoComplete="off" {...form.register('documentNumber')} />
                )}
              </FormField>
              {category !== 'citizen' && (
                <FormField
                  label={t('nationality')}
                  required
                  error={errors.nationality?.message}
                  className="sm:col-span-2"
                >
                  {(control) => (
                    <Input
                      {...control}
                      autoComplete="country-name"
                      {...form.register('nationality')}
                    />
                  )}
                </FormField>
              )}
              <FormField label={t('firstName')} required error={errors.firstName?.message}>
                {(control) => (
                  <Input {...control} autoComplete="given-name" {...form.register('firstName')} />
                )}
              </FormField>
              <FormField label={t('lastName')} required error={errors.lastName?.message}>
                {(control) => (
                  <Input {...control} autoComplete="family-name" {...form.register('lastName')} />
                )}
              </FormField>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <FormField label={t('phone')} required error={errors.phone?.message}>
                {(control) => (
                  <Input {...control} type="tel" autoComplete="tel" {...form.register('phone')} />
                )}
              </FormField>
              <FormField label={t('email')} required error={errors.email?.message}>
                {(control) => (
                  <Input
                    {...control}
                    type="email"
                    autoComplete="email"
                    {...form.register('email')}
                  />
                )}
              </FormField>
              <FormField
                label={t('password')}
                required
                help={t('passwordHint')}
                error={errors.password?.message}
              >
                {(control) => (
                  <Input
                    {...control}
                    type="password"
                    autoComplete="new-password"
                    {...form.register('password')}
                  />
                )}
              </FormField>
              <Controller
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <div className="grid gap-1">
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        aria-invalid={Boolean(errors.agree)}
                        className="mt-0.5"
                      />
                      {t('agree')}
                    </label>
                    {errors.agree && (
                      <p role="alert" className="text-sm text-destructive-foreground">
                        {errors.agree.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          )}
        </Card>

        <div className="flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              {common('back')}
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button size="lg" onClick={next}>
              {common('continue')}
            </Button>
          ) : (
            <Button type="submit" size="lg" loading={register.isPending}>
              {t('create')}
            </Button>
          )}
        </div>
      </form>

      <p className="text-center">
        {t('haveAccount')}{' '}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          {t('signInTitle')}
        </Link>
      </p>
    </div>
  );
}
