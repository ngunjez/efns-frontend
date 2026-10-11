'use client';

import { useId } from 'react';
import { useSaveSettings, useSettings } from '@/api/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DynamicForm, type FormDefinition } from '@/components/common/dynamic-form';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';

const definition: FormDefinition = {
  title: 'Sign-in and privacy',
  submitLabel: 'Save changes',
  successMessage: 'Setting saved.',
  sections: [
    {
      title: 'Sign-in',
      fields: [
        {
          name: 'idleMinutes',
          label: 'Lock the screen after (minutes idle)',
          type: 'number',
          required: true,
          min: 5,
          max: 60,
          span: 1,
        },
        {
          name: 'lockoutAttempts',
          label: 'Lock the account after (failed attempts)',
          type: 'number',
          required: true,
          min: 3,
          max: 10,
          span: 1,
        },
        {
          name: 'sessionHours',
          label: 'Sign out after (hours)',
          type: 'number',
          required: true,
          min: 1,
          max: 12,
          span: 1,
        },
        {
          name: 'outsideHours',
          label: 'Allow filing outside opening hours',
          type: 'switch',
          help: 'Off: credentials cannot be used overnight.',
        },
      ],
    },
    {
      title: 'Records',
      fields: [
        {
          name: 'retentionYears',
          label: 'Keep application records for (years)',
          type: 'number',
          required: true,
          min: 1,
          max: 30,
          span: 1,
        },
        {
          name: 'biometricRetentionDays',
          label: 'Keep biometric captures for (days)',
          type: 'number',
          required: true,
          min: 1,
          max: 365,
          span: 1,
        },
        {
          name: 'maskClientData',
          label: 'Mask client phone and email in staff lists',
          type: 'switch',
        },
      ],
    },
  ],
};

export function SignInPrivacySettings() {
  const formId = useId();
  const query = useSettings<Record<string, unknown>>('sign-in');
  const save = useSaveSettings('sign-in');

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Sign-in and privacy"
        description="Idle time, lockout and how long records are kept. Multi-factor sign-in is always on for every staff role."
        actions={
          <Button type="submit" form={formId} loading={save.isPending}>
            Save changes
          </Button>
        }
      />
      <Card className="max-w-3xl p-5 sm:p-6">
        <QueryState query={query} loading={<LoadingBlock rows={6} className="p-0" />}>
          {(values) => (
            <DynamicForm
              formId={formId}
              definition={definition}
              record={values}
              onSubmit={(next) => save.mutateAsync(next)}
            />
          )}
        </QueryState>
      </Card>
    </div>
  );
}
