import { z } from 'zod';
import type { CustomField } from '@/types/register';
import type { FieldDef, FormSectionDef } from './types';

const PHONE = /^\+?[0-9\s-]{9,15}$/;

function fieldSchema(field: FieldDef): z.ZodType {
  const requiredMessage = `${field.label} is required`;
  switch (field.type) {
    case 'number': {
      let schema = z.number({ error: `${field.label} must be a number` });
      if (field.min !== undefined)
        schema = schema.min(field.min, `${field.label} must be at least ${field.min}`);
      if (field.max !== undefined)
        schema = schema.max(field.max, `${field.label} must be at most ${field.max}`);
      const empty = (value: unknown) => (value === '' || value === null ? undefined : value);
      return field.required
        ? z.preprocess(empty, z.coerce.number({ error: requiredMessage }).pipe(schema))
        : z.preprocess(empty, z.coerce.number().pipe(schema).optional());
    }
    case 'switch':
      return z.boolean();
    case 'multiselect':
    case 'toggles': {
      const schema = z.array(z.string());
      return field.required
        ? schema.min(1, `Choose at least one ${field.label.toLowerCase()}`)
        : schema;
    }
    case 'matrix':
      return z.record(z.string(), z.array(z.string()));
    case 'file':
      return field.required
        ? z.instanceof(File, { error: requiredMessage })
        : z.instanceof(File).optional();
    case 'email': {
      const schema = z.email(`Enter a valid email address`);
      return field.required ? schema : schema.or(z.literal(''));
    }
    case 'tel': {
      const schema = z.string().regex(PHONE, 'Enter a valid phone number');
      return field.required ? schema : schema.or(z.literal(''));
    }
    default: {
      const schema = z.string().trim();
      return field.required ? schema.min(1, requiredMessage) : schema;
    }
  }
}

function emptyValue(field: FieldDef): unknown {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case 'switch':
      return false;
    case 'multiselect':
    case 'toggles':
      return [];
    case 'matrix':
      return {};
    case 'number':
    case 'file':
      return undefined;
    default:
      return '';
  }
}

export function allFields(sections: FormSectionDef[]) {
  return sections.flatMap((section) => section.fields);
}

export function buildSchema(sections: FormSectionDef[]) {
  return z.object(
    Object.fromEntries(allFields(sections).map((field) => [field.name, fieldSchema(field)])),
  );
}

export function buildDefaults(sections: FormSectionDef[], record?: Record<string, unknown>) {
  return Object.fromEntries(
    allFields(sections).map((field) => [field.name, record?.[field.name] ?? emptyValue(field)]),
  );
}

export function customFieldToDef(field: CustomField): FieldDef {
  const type = field.type === 'boolean' ? 'switch' : field.type;
  return {
    name: field.name,
    label: field.label,
    type,
    required: field.required && type !== 'switch',
    help: field.help,
    options: field.options?.map((option) => ({ value: option, label: option })),
  };
}
