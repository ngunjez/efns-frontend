'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useCustomFields } from '@/api/hooks/use-register';
import { Badge } from '@/components/ui/badge';
import type { ApiError } from '@/types/api';
import { buildDefaults, buildSchema, customFieldToDef } from './schema';
import { FieldControl } from './FieldControl';
import type { FormDefinition, FormSectionDef } from './types';

/**
 * Builds a whole form — layout, controls, validation and server-error mapping —
 * from a FormDefinition. Submit lives outside (drawer footer) via `formId`.
 */
export function DynamicForm({
  formId,
  definition,
  record,
  onSubmit,
}: {
  formId: string;
  definition: FormDefinition;
  record?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<unknown>;
}) {
  const custom = useCustomFields(definition.customFieldsPage ?? '');
  const customFields = useMemo(
    () => (definition.customFieldsPage ? (custom.data ?? []) : []),
    [definition.customFieldsPage, custom.data],
  );

  const sections = useMemo<FormSectionDef[]>(
    () =>
      customFields.length > 0
        ? [
            ...definition.sections,
            { title: 'Custom fields', fields: customFields.map(customFieldToDef) },
          ]
        : definition.sections,
    [definition.sections, customFields],
  );

  const schema = useMemo(() => buildSchema(sections), [sections]);
  const form = useForm<FieldValues>({
    resolver: zodResolver(schema),
    values: buildDefaults(sections, record),
    resetOptions: { keepDirtyValues: true },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      // Map the API's field-level validation messages back onto the inputs.
      Object.entries((error as ApiError).fieldErrors ?? {}).forEach(([name, message]) =>
        form.setError(name, { message }),
      );
    }
  });

  return (
    <form id={formId} noValidate onSubmit={submit} className="grid gap-7">
      {sections.map((section, index) => (
        <section key={section.title ?? index} className="grid gap-4" aria-label={section.title}>
          {section.title && (
            <h3 className="flex items-center justify-between text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {section.title}
              {section.title === 'Custom fields' && (
                <Badge tone="info">
                  {customFields.length} field{customFields.length === 1 ? '' : 's'}
                </Badge>
              )}
            </h3>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <FieldControl key={field.name} field={field} control={form.control} />
            ))}
          </div>
        </section>
      ))}
      {definition.customFieldsPage && (
        <Link
          href="/admin/settings/modules"
          className="flex items-center justify-center gap-1 rounded-field border border-dashed border-primary/50 py-3 text-sm font-semibold text-primary hover:bg-primary-tint"
        >
          <Plus className="size-4" aria-hidden /> Add field
        </Link>
      )}
    </form>
  );
}
