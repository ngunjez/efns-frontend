'use client';

import { ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fieldClasses } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { FieldOption } from './dynamic-form/types';

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Choose',
  id,
  ...aria
}: {
  options: FieldOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}) {
  const labelFor = (item: string) => options.find((option) => option.value === item)?.label ?? item;
  const toggle = (item: string, checked: boolean) =>
    onChange(checked ? [...value, item] : value.filter((entry) => entry !== item));

  return (
    <div className={cn(fieldClasses, 'flex min-h-12 flex-wrap items-center gap-1.5 px-2 py-1.5')}>
      {value.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1 rounded-control bg-primary-tint px-2 py-1 text-xs font-medium text-primary"
        >
          {labelFor(item)}
          <button
            type="button"
            aria-label={`Remove ${labelFor(item)}`}
            onClick={() => toggle(item, false)}
            className="rounded-sm hover:bg-primary/10"
          >
            <X className="size-3" aria-hidden />
          </button>
        </span>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger
          id={id}
          {...aria}
          className="ml-auto inline-flex items-center gap-1 rounded-control px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
        >
          {value.length === 0 ? placeholder : 'Add'}
          <ChevronDown className="size-4" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={value.includes(option.value)}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) => toggle(option.value, checked)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
