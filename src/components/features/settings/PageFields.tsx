'use client';

import { useState } from 'react';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useCustomFields,
  useDeleteCustomField,
  useSaveCustomField,
} from '@/api/hooks/use-register';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormDrawer, type FormDefinition } from '@/components/common/dynamic-form';
import { FormField } from '@/components/common/FormField';
import { EmptyState, LoadingBlock, QueryState } from '@/components/common/QueryState';
import { adminPages } from '@/config/pages/admin';
import type { CustomField } from '@/types/register';

const PAGES = Object.values(adminPages)
  .filter((page) => page.form)
  .map((page) => ({ value: page.key, label: page.title }));

const TYPE_LABELS: Record<CustomField['type'], string> = {
  text: 'Text',
  number: 'Number',
  boolean: 'Yes or No',
  select: 'Dropdown',
  date: 'Date',
  tel: 'Phone',
  file: 'File',
};

const fieldForm: FormDefinition = {
  title: 'Add field',
  description: 'Appears on the page as soon as you save.',
  submitLabel: 'Save field',
  successMessage: 'Field saved.',
  sections: [
    {
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        {
          name: 'type',
          label: 'Type',
          type: 'segmented',
          required: true,
          options: Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
          defaultValue: 'text',
        },
        {
          name: 'options',
          label: 'Dropdown choices',
          type: 'textarea',
          help: 'Only for Dropdown: one choice per line.',
        },
        { name: 'help', label: 'Help text', type: 'text' },
        {
          name: 'required',
          label: 'Required',
          type: 'switch',
          help: 'The record cannot be saved without it',
        },
        {
          name: 'showInTable',
          label: 'Show as a table column',
          type: 'switch',
          help: 'On the page list',
        },
      ],
    },
  ],
};

export default function PageFields() {
  const [page, setPage] = useState(PAGES[0]?.value ?? '');
  const query = useCustomFields(page);
  const save = useSaveCustomField(page);
  const remove = useDeleteCustomField(page);
  const [editing, setEditing] = useState<{ open: boolean; field?: CustomField }>({ open: false });

  const submit = async (values: Record<string, unknown>) => {
    const field = {
      label: String(values.label),
      type: values.type as CustomField['type'],
      help: values.help ? String(values.help) : undefined,
      required: Boolean(values.required),
      showInTable: Boolean(values.showInTable),
      options:
        values.type === 'select'
          ? String(values.options ?? '')
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          : undefined,
    };
    await save.mutateAsync({ name: editing.field?.name, field });
    setEditing({ open: false });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fields</CardTitle>
        <Button size="sm" onClick={() => setEditing({ open: true })}>
          <Plus aria-hidden /> Add field
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormField label="Page">
          {(control) => (
            <Select value={page} onValueChange={setPage}>
              <SelectTrigger {...control} className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <p className="text-xs text-muted-foreground">
          The toggle makes a field required. Fields you added can be edited or deleted.
        </p>
        <QueryState
          query={query}
          loading={<LoadingBlock rows={3} className="p-0" />}
          isEmpty={(fields) => fields.length === 0}
          empty={<EmptyState title="No custom fields yet" className="py-6" />}
        >
          {(fields) => (
            <ul className="divide-y">
              {fields.map((field) => (
                <li key={field.name} className="flex items-center gap-2 py-2.5">
                  <GripVertical className="size-4 text-muted-foreground" aria-hidden />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-sm font-semibold">{field.label}</span>
                    <span className="text-xs text-muted-foreground">{TYPE_LABELS[field.type]}</span>
                  </span>
                  <Switch
                    aria-label={`${field.label} required`}
                    checked={field.required}
                    onCheckedChange={(required) =>
                      save.mutate({ name: field.name, field: { ...field, required } })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${field.label}`}
                    onClick={() => setEditing({ open: true, field })}
                  >
                    <Pencil className="text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${field.label}`}
                    onClick={() => remove.mutate(field.name)}
                  >
                    <Trash2 className="text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </QueryState>
      </CardContent>
      <FormDrawer
        open={editing.open}
        onOpenChange={(open) => setEditing((current) => ({ ...current, open }))}
        definition={fieldForm}
        record={
          editing.field
            ? { ...editing.field, options: editing.field.options?.join('\n') }
            : undefined
        }
        saving={save.isPending}
        onSubmit={submit}
      />
    </Card>
  );
}
