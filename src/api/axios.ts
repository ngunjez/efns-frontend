import axios, { AxiosError } from 'axios';
import { env } from '@/config/env';
import { reportError } from '@/lib/monitoring';
import type { ApiError } from '@/types/api';

/**
 * The only HTTP client in the app. Authentication rides on the httpOnly
 * session cookie the API sets at sign-in (`withCredentials`), so no token is
 * ever readable from JavaScript or stored in localStorage.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

type SessionHandler = (error: ApiError) => void;
let onSessionError: SessionHandler | null = null;

/**
 * Registered once by the providers: decides where to send the user when the
 * session expires (401) or the request comes from outside their hub (403
 * OUTSIDE_HUB, geofence layer 5). Keeps routing out of the HTTP layer.
 */
export function setSessionErrorHandler(handler: SessionHandler | null) {
  onSessionError = handler;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const body = error.response?.data as
      (Partial<ApiError> & { errors?: Record<string, string> }) | undefined;
    return {
      status: error.response?.status ?? 0,
      code: body?.code ?? (error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK_ERROR'),
      message:
        body?.message ??
        (error.response
          ? 'Something went wrong. Please try again.'
          : 'We could not reach the server. Check the connection and try again.'),
      fieldErrors: body?.fieldErrors ?? body?.errors,
    };
  }
  return { status: 0, code: 'UNKNOWN', message: 'Something went wrong. Please try again.' };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    if (apiError.status === 401 || apiError.code === 'OUTSIDE_HUB') onSessionError?.(apiError);
    if (apiError.status >= 500 || apiError.status === 0)
      reportError(error, { code: apiError.code });
    return Promise.reject(apiError);
  },
);
