'use client';

import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { useOptionsSource } from '@/api/hooks/use-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FormField } from '../FormField';
import { MultiSelect } from '../MultiSelect';
import { SegmentedControl } from '../SegmentedControl';
import type { FieldDef } from './types';

export function FieldControl({
  field,
  control,
}: {
  field: FieldDef;
  control: Control<FieldValues>;
}) {
  const sourced = useOptionsSource(field.optionsSource);
  const options = field.options ?? sourced.data ?? [];

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: input, fieldState }) => {
        const error = fieldState.error?.message;

        if (field.type === 'switch') {
          return (
            <div className="flex items-center justify-between gap-4 sm:col-span-2">
              <span className="grid gap-0.5">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.help && <span className="text-xs text-muted-foreground">{field.help}</span>}
              </span>
              <Switch
                id={field.name}
                checked={Boolean(input.value)}
                onCheckedChange={input.onChange}
              />
            </div>
          );
        }

        if (field.type === 'toggles') {
          const value = (input.value as string[]) ?? [];
          return (
            <fieldset className="grid gap-1 sm:col-span-2">
              <legend className="mb-2 text-[0.9375rem] font-semibold">{field.label}</legend>
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center justify-between gap-4 rounded-control px-1 py-2 hover:bg-muted/50"
                >
                  <span className="text-sm">{option.label}</span>
                  <Switch
                    checked={value.includes(option.value)}
                    onCheckedChange={(checked) =>
                      input.onChange(
                        checked
                          ? [...value, option.value]
                          : value.filter((v) => v !== option.value),
                      )
                    }
                  />
                </label>
              ))}
              {error && (
                <p role="alert" className="text-sm text-destructive-foreground">
                  {error}
                </p>
              )}
            </fieldset>
          );
        }

        if (field.type === 'matrix') {
          const value = (input.value as Record<string, string[]>) ?? {};
          const columns = field.matrixColumns ?? [];
          return (
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {field.label}
              </legend>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs">
                    <th scope="col" className="py-2 text-left font-semibold">
                      System
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column.value}
                        scope="col"
                        className="w-16 py-2 text-center font-semibold"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {options.map((row) => (
                    <tr key={row.value} className="border-b last:border-0">
                      <th scope="row" className="py-2.5 text-left font-normal">
                        {row.label}
                      </th>
                      {columns.map((column) => {
                        const checked = value[row.value]?.includes(column.value) ?? false;
                        return (
                          <td key={column.value} className="text-center">
                            <Checkbox
                              aria-label={`${row.label}: ${column.label}`}
                              checked={checked}
                              onCheckedChange={(next) => {
                                const current = value[row.value] ?? [];
                                input.onChange({
                                  ...value,
                                  [row.value]: next
                                    ? [...current, column.value]
                                    : current.filter((v) => v !== column.value),
                                });
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
          );
        }

        return (
          <FormField
            label={field.label}
            required={field.required}
            error={error}
            help={field.help}
            className={cn(field.span === 1 ? 'sm:col-span-1' : 'sm:col-span-2')}
          >
            {(aria) => {
              switch (field.type) {
                case 'textarea':
                  return (
                    <Textarea
                      {...aria}
                      {...input}
                      value={(input.value as string) ?? ''}
                      placeholder={field.placeholder}
                    />
                  );
                case 'select':
                  return (
                    <Select
                      value={(input.value as string) || undefined}
                      onValueChange={input.onChange}
                    >
                      <SelectTrigger {...aria} onBlur={input.onBlur}>
                        <SelectValue placeholder={field.placeholder ?? 'Choose'} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case 'multiselect':
                  return (
                    <MultiSelect
                      {...aria}
                      options={options}
                      value={(input.value as string[]) ?? []}
                      onChange={input.onChange}
                      placeholder={field.placeholder}
                    />
                  );
                case 'segmented':
                  return (
                    <SegmentedControl
                      label={field.label}
                      options={options}
                      value={input.value as string}
                      onValueChange={input.onChange}
                      size="sm"
                    />
                  );
                case 'file':
                  return (
                    <Input
                      {...aria}
                      type="file"
                      className="h-auto py-2.5"
                      onBlur={input.onBlur}
                      onChange={(event) => input.onChange(event.target.files?.[0])}
                    />
                  );
                default:
                  return (
                    <Input
                      {...aria}
                      {...input}
                      value={(input.value as string | number | undefined) ?? ''}
                      type={field.type === 'tel' ? 'tel' : field.type}
                      inputMode={field.type === 'number' ? 'decimal' : undefined}
                      placeholder={field.placeholder}
                    />
                  );
              }
            }}
          </FormField>
        );
      }}
    />
  );
}
