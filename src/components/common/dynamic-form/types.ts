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

export type OptionsSource = 'hubs' | 'services' | 'roles';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: FieldOption[];
  optionsSource?: OptionsSource;
  matrixColumns?: FieldOption[];
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
  customFieldsPage?: string;
}
