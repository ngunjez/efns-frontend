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

/**
 * A column is data, not JSX: admin pages declare columns in config and the
 * table renders them. `render` is the escape hatch for one-off cells.
 */
export interface ColumnDef<Row = Record<string, unknown>> {
  /** Dotted path into the row. */
  key: string;
  header: string;
  kind?: CellKind;
  /** Second, muted line under the value (entity, person, text). */
  subKey?: string;
  /** Icon for `entity` cells. */
  icon?: IconKey;
  /** Row field holding a tone for the entity icon tile. */
  toneKey?: string;
  /** For raw enum values: value → tone (and optional label). Objects `{label, tone}` render as-is. */
  tones?: Record<string, BadgeTone>;
  labels?: Record<string, string>;
  /** Progress bar colour thresholds; otherwise the row's `{value, tone}` is used. */
  thresholds?: { success: number; warning: number };
  align?: 'left' | 'right';
  /** Hide on small screens to keep tables readable on a phone. */
  hideBelow?: 'sm' | 'md' | 'lg';
  hiddenByDefault?: boolean;
  render?: (row: Row) => ReactNode;
}

export interface RowAction {
  /** "edit" and "delete" are handled by the register; anything else posts to the record's action endpoint. */
  action: 'edit' | 'delete' | (string & {});
  label: string;
  destructive?: boolean;
  /** Actions that need input first (a reason, a second sign-off) open this form in the drawer. */
  form?: FormDefinition;
}
