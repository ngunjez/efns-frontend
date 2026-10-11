import type { ColumnDef, RowAction } from '@/components/common/data-table';
import type { FormDefinition } from '@/components/common/dynamic-form';
import type { SeriesDef } from '@/components/common/charts/BarChartView';
import type { CustomWidgetKey } from './custom-widgets';

export type WidgetDef =
  | {
      type: 'table';
      title: string;
      columns: ColumnDef[];
      searchPlaceholder: string;
      selectable?: boolean;
      rowActions?: RowAction[];
      actionStyle?: 'icons' | 'menu';
    }
  | { type: 'bar-chart'; id: string; title: string; series: SeriesDef[]; stacked?: boolean }
  | { type: 'donut'; id: string; title: string; caption: string }
  | { type: 'meters'; id: string; title: string }
  | { type: 'list'; id: string; title: string; variant?: 'status' | 'timeline' }
  | { type: 'tiles'; id: string; title?: string; columns?: 2 | 3 | 4 }
  | { type: 'checklist'; id: string; title: string }
  | { type: 'custom'; id: string; component: CustomWidgetKey };

export interface PageRow {
  main: WidgetDef[];
  aside?: WidgetDef[];
}

/**
 * An entire admin page as data: header, widgets, table, add/edit drawer and
 * delete confirmation. One renderer (RegisterPage) draws all of them, so a new
 * register is a new definition file, not a new component.
 */
export interface PageDefinition {
  /** Register key: API collection, custom-fields page and query cache key. */
  key: string;
  title: string;
  description: string;
  /** "Add …" drawer; also used to edit a row. */
  form?: FormDefinition;
  createLabel?: string;
  /** Show "Customize page" (links to Settings › Modules and fields). */
  customizable?: boolean;
  /** Delete confirmation. `{name}` in the description is replaced with the row's `nameKey` field. */
  remove?: {
    title: string;
    description: string;
    successMessage: string;
    nameKey?: string;
    reassignLabel?: string;
  };
  rows: PageRow[];
  pageSize?: number;
}
