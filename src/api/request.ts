import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './axios';

/** Thin typed wrappers so hooks read as one line and never unwrap `.data` by hand. */
export const request = {
  get: <T>(url: string, params?: AxiosRequestConfig['params']) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, body?: unknown) => apiClient.post<T>(url, body).then((r) => r.data),
  put: <T>(url: string, body?: unknown) => apiClient.put<T>(url, body).then((r) => r.data),
  patch: <T>(url: string, body?: unknown) => apiClient.patch<T>(url, body).then((r) => r.data),
  delete: <T>(url: string, body?: unknown) =>
    apiClient.delete<T>(url, { data: body }).then((r) => r.data),
  upload: <T>(url: string, form: FormData) =>
    apiClient
      .post<T>(url, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};
