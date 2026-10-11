export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'segmented'
  | 'switch'
  | 'toggles'
  | 'matrix'
  | 'file';

export interface FieldOption {
  value: string;
  label: string;
  hint?: string;
}

/** Option lists that come from the API instead of the definition. */
export type OptionsSource = 'hubs' | 'services' | 'roles';

/**
 * One form field, declared as data. The same definitions drive the drawer
 * forms, their validation and the custom fields administrators add, which is
 * how the platform adds services and fields without a release (doc §4.7).
 */
export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: FieldOption[];
  optionsSource?: OptionsSource;
  /** Columns for `matrix` fields, e.g. View / Edit per system. */
  matrixColumns?: FieldOption[];
  /** Width in the two-column grid. Defaults to full width for long controls. */
  span?: 1 | 2;
  min?: number;
  max?: number;
  defaultValue?: unknown;
}

export interface FormSectionDef {
  title?: string;
  fields: FieldDef[];
}

export interface FormDefinition {
  title: string;
  description?: string;
  submitLabel: string;
  successMessage: string;
  sections: FormSectionDef[];
  /** Append the custom fields administrators added to this page. */
  customFieldsPage?: string;
}
