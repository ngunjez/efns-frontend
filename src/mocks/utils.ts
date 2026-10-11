import { delay, HttpResponse } from 'msw';
import { env } from '@/config/env';
import type { ApiError } from '@/types/api';

/** Absolute URL for a mocked endpoint (MSW matches the full URL the app calls). */
export const api = (path: string) => `${env.apiBaseUrl}${path}`;

/** A realistic pause so loading states are visible while developing. */
export const latency = () => delay(250);

export function apiError(
  status: number,
  message: string,
  code = 'ERROR',
  fieldErrors?: Record<string, string>,
) {
  return HttpResponse.json<ApiError>({ status, code, message, fieldErrors }, { status });
}

/** Survives page reloads in the same tab, like a real session cookie would. */
export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = sessionStorage.getItem(`mock:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      sessionStorage.setItem(`mock:${key}`, JSON.stringify(value));
    } catch {
      /* storage unavailable: state lasts for this page only */
    }
  },
  remove(key: string) {
    try {
      sessionStorage.removeItem(`mock:${key}`);
    } catch {
      /* ignore */
    }
  },
};

export function paginate<T>(rows: T[], url: URL) {
  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
  const search = url.searchParams.get('search')?.toLowerCase();
  const filtered = search
    ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search))
    : rows;
  return {
    data: filtered.slice((page - 1) * pageSize, page * pageSize),
    meta: { page, pageSize, total: filtered.length },
  };
}
