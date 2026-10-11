import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import type { Booking } from '@/api/hooks/use-catalogue';
import type { ClientUser } from '@/types/auth';
import { application, applicationWithRequest } from '../data/application';
import { api, apiError, latency, store } from '../utils';

const SESSION = 'client-session';
const ACCOUNTS = 'client-accounts';
const PENDING = 'client-pending';
export const CLIENT_SESSION = SESSION;
export const CLIENT_APPOINTMENT = 'client-appointment';

export interface Account extends ClientUser {
  phone: string;
  email: string;
}

const demo: Account = {
  id: 'cli-1',
  name: 'Priya Raman',
  reference: 'CLI-2026-004812',
  phone: '0745220318',
  email: 'priya.raman@mail.example',
};

const normalise = (value: string) => value.replace(/\s+/g, '').toLowerCase();
const accounts = () => store.get<Account[]>(ACCOUNTS, [demo]);
const toUser = ({ id, name, reference }: Account): ClientUser => ({ id, name, reference });

export const clientHandlers = [
  http.post(api(ENDPOINTS.client.register), async ({ request }) => {
    await latency();
    const input = (await request.json()) as {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    const account: Account = {
      id: crypto.randomUUID(),
      name: `${input.firstName} ${input.lastName}`.trim(),
      reference: `CLI-2026-${String(Math.floor(Math.random() * 1e6)).padStart(6, '0')}`,
      phone: normalise(input.phone),
      email: normalise(input.email),
    };
    store.set(PENDING, account);
    return HttpResponse.json({ verificationId: account.id });
  }),

  http.post(api(ENDPOINTS.client.verifyPhone), async ({ request }) => {
    await latency();
    const { code } = (await request.json()) as { code: string };
    if (code === '000000')
      return apiError(400, 'That code has expired. We sent you a new one.', 'INVALID_CODE');
    const pending = store.get<Account | null>(PENDING, null);
    if (pending) store.set(ACCOUNTS, [...accounts(), pending]);
    store.remove(PENDING);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(api(ENDPOINTS.client.signIn), async ({ request }) => {
    await latency();
    const { identifier, password } = (await request.json()) as {
      identifier: string;
      password: string;
    };
    if (!identifier || !password) return apiError(400, 'Enter your phone or email and password.');
    const key = normalise(identifier);
    const account = accounts().find((item) => item.phone === key || item.email === key);
    if (!account)
      return apiError(
        401,
        'We could not find an account with those details.',
        'INVALID_CREDENTIALS',
      );
    store.set(SESSION, account);
    return HttpResponse.json(toUser(account));
  }),

  http.post(api(ENDPOINTS.client.signOut), async () => {
    store.remove(SESSION);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(api(ENDPOINTS.client.me), () => {
    const client = store.get<Account | null>(SESSION, null);
    return client
      ? HttpResponse.json(toUser(client))
      : apiError(401, 'Not signed in.', 'UNAUTHENTICATED');
  }),

  http.get(api(ENDPOINTS.client.application), async () => {
    await latency();
    if (!store.get(SESSION, null)) return apiError(401, 'Not signed in.', 'UNAUTHENTICATED');
    return HttpResponse.json(null);
  }),

  http.get(api(ENDPOINTS.client.appointment), async () => {
    await latency();
    if (!store.get(SESSION, null)) return apiError(401, 'Not signed in.', 'UNAUTHENTICATED');
    return HttpResponse.json(store.get<Booking | null>(CLIENT_APPOINTMENT, null));
  }),

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
