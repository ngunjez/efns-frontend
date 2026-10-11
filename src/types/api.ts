/** Envelope for every paginated list the API returns. */
export interface Paginated<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number };
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  [filter: string]: string | number | boolean | undefined;
}

/** Normalised error every API failure is converted into (see src/api/axios.ts). */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  /** Server-side validation messages keyed by field name, mapped onto the form. */
  fieldErrors?: Record<string, string>;
}

export type Id = string;
