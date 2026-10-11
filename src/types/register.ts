import type { Kpi, Status } from './domain';
import type { Paginated } from './api';

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

export interface CustomField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'tel' | 'file';
  required: boolean;
  options?: string[];
  help?: string;
  showInTable: boolean;
}
