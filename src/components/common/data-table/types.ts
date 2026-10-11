import type { ReactNode } from 'react';
import type { BadgeTone } from '@/components/ui/badge';
import type { IconKey } from '@/config/icons';
import type { FormDefinition } from '../dynamic-form/types';

export type CellKind =
  | 'text'
  | 'strong'
  | 'muted'
  | 'entity'
  | 'person'
  | 'status'
  | 'statuses'
  | 'money'
  | 'number'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'progress'
  | 'mono';

export interface ColumnDef<Row = Record<string, unknown>> {
  key: string;
  header: string;
  kind?: CellKind;
  subKey?: string;
  icon?: IconKey;
  toneKey?: string;
  tones?: Record<string, BadgeTone>;
  labels?: Record<string, string>;
  thresholds?: { success: number; warning: number };
  align?: 'left' | 'right';
  hideBelow?: 'sm' | 'md' | 'lg';
  hiddenByDefault?: boolean;
  render?: (row: Row) => ReactNode;
}

export interface RowAction {
  action: 'edit' | 'delete' | (string & {});
  label: string;
  destructive?: boolean;
  form?: FormDefinition;
}
