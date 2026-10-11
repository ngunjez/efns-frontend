import type { ColumnDef, RowAction } from '@/components/common/data-table';
import type { FieldDef } from '@/components/common/dynamic-form';

export const hubColumn: ColumnDef = {
  key: 'hub',
  header: 'Hub',
  kind: 'entity',
  subKey: 'hubCode',
  icon: 'building',
  toneKey: 'tone',
};

export const MENU_ACTIONS: RowAction[] = [
  { action: 'edit', label: 'Edit' },
  { action: 'delete', label: 'Delete', destructive: true },
];

export const ICON_ACTIONS: RowAction[] = [
  { action: 'edit', label: 'Edit' },
  { action: 'delete', label: 'Delete' },
];

export const hubField: FieldDef = {
  name: 'hubId',
  label: 'Hub',
  type: 'select',
  optionsSource: 'hubs',
  required: true,
  span: 1,
};
export const serviceField: FieldDef = {
  name: 'serviceId',
  label: 'Service',
  type: 'select',
  optionsSource: 'services',
  required: true,
};

export const options = (...labels: string[]) => labels.map((label) => ({ value: label, label }));

export const SYSTEMS = options(
  'Agency Platform',
  'Service Catalogue',
  'Hub Management',
  'Document and Vault',
  'Logistics',
  'Notifications',
  'CRM',
  'Call Centre',
  'Workforce Management',
  'Quality Management',
  'ERP',
  'Management Reporting',
);

export const ROLES = options(
  'Service Officer',
  'Verification Officer',
  'QA Reviewer',
  'Hub Manager',
  'Support Agent',
  'Customer Experience Manager',
  'Operations Manager',
  'Service Owner',
  'Vault Custodian',
  'Despatch Clerk',
  'Cashier / Finance Officer',
  'Workforce / HR Manager',
  'Quality / Compliance Officer',
  'Platform Administrator',
);

export const SEVERITY_TONES = { minor: 'info', major: 'warning', critical: 'danger' } as const;
