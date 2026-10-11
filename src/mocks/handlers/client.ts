import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import type { ClientUser } from '@/types/auth';
import { application, applicationWithRequest } from '../data/application';
import { api, apiError, latency, store } from '../utils';

const SESSION = 'client-session';
const priya: ClientUser = { id: 'cli-1', name: 'Priya Raman', reference: 'CLI-2026-004812' };

export const clientHandlers = [
  http.post(api(ENDPOINTS.client.signIn), async ({ request }) => {
    await latency();
    const { identifier, password } = (await request.json()) as {
      identifier: string;
      password: string;
    };
    if (!identifier || !password) return apiError(400, 'Enter your phone or email and password.');
    store.set(SESSION, priya);
    return HttpResponse.json(priya);
  }),
  http.post(api(ENDPOINTS.client.register), async () => {
    await latency();
    return HttpResponse.json({ verificationId: 'verify-1' });
  }),
  http.post(api(ENDPOINTS.client.verifyPhone), async ({ request }) => {
    await latency();
    const { code } = (await request.json()) as { code: string };
    if (code === '000000')
      return apiError(400, 'That code has expired. We sent you a new one.', 'INVALID_CODE');
    store.set(SESSION, priya);
    return HttpResponse.json(priya);
  }),
  http.get(api(ENDPOINTS.client.me), async () => {
    const client = store.get<ClientUser | null>(SESSION, null);
    return client ? HttpResponse.json(client) : apiError(401, 'Not signed in.', 'UNAUTHENTICATED');
  }),
  http.get(api(ENDPOINTS.client.application), async () => {
    await latency();
    return HttpResponse.json(store.get(SESSION, null) ? application : null);
  }),
  // AAS-2026-004812 shows the tracking view; any reference ending in "-Q" shows the document request.
  http.get(api(ENDPOINTS.client.track(':reference')), async ({ params }) => {
    await latency();
    const reference = String(params.reference);
    if (reference.endsWith('-Q'))
      return HttpResponse.json({ ...applicationWithRequest, reference: reference.slice(0, -2) });
    if (reference !== application.reference)
      return apiError(404, 'Application not found.', 'NOT_FOUND');
    return HttpResponse.json(application);
  }),
  http.post(api(ENDPOINTS.client.uploadDocument(':reference')), async () => {
    await latency();
    return new HttpResponse(null, { status: 204 });
  }),
];
