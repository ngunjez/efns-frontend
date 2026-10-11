import type { Kpi, Status } from './domain';
import type { Paginated } from './api';

/** A KPI card beside the page header ("Service charge income", "See Report →"). */
export interface SummaryCard extends Kpi {
  href?: string;
}

export interface ChartPoint {
  label: string;
  [series: string]: string | number;
}

export interface MeterItem {
  label: string;
  value: number;
  display: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
}

export interface ListItem {
  title: string;
  detail?: string;
  status?: Status;
  /** Coloured dot for timelines such as "Escalation path". */
  tone?: Status['tone'];
}

export interface TileItem {
  label: string;
  value: string;
  status?: Status;
}

export interface ChecklistItem {
  label: string;
  detail?: string;
  done: boolean;
}

/** Data for every widget on a page, keyed by the widget id in its definition. */
export type WidgetData =
  | { kind: 'chart'; points: ChartPoint[]; total?: string; delta?: Kpi['delta']; caption?: string }
  | { kind: 'donut'; total: string; slices: { label: string; value: number; display: string }[] }
  | { kind: 'meters'; items: MeterItem[]; badge?: string; caption?: string }
  | { kind: 'list'; items: ListItem[]; subtitle?: string }
  | { kind: 'tiles'; items: TileItem[] }
  | {
      kind: 'checklist';
      items: ChecklistItem[];
      subtitle?: string;
      note?: string;
      /** A record action unlocked when every item is done, e.g. "Accredit and go live". */
      action?: { label: string; enabled: boolean; recordId: string; name: string };
    };

export interface RegisterSummary {
  stats?: Kpi[];
  cards?: SummaryCard[];
  widgets?: Record<string, WidgetData>;
}

export type RegisterRow = { id: string } & Record<string, unknown>;

export interface RegisterResponse<Row = RegisterRow> extends Paginated<Row> {
  summary?: RegisterSummary;
}

/** A field an administrator added in Settings › Modules and fields. */
export interface CustomField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'tel' | 'file';
  required: boolean;
  options?: string[];
  help?: string;
  showInTable: boolean;
}
