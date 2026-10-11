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

export interface ApiError {
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export type Id = string;
