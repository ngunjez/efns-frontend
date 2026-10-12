import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import type { StaffUser } from '@/types/auth';
import { demoUserFor } from '../data/users';
import { api, apiError, latency, store } from '../utils';

const SESSION = 'staff-session';
const CHALLENGE = 'staff-challenge';

export const authHandlers = [
  http.post(api(ENDPOINTS.auth.staffSignIn), async ({ request }) => {
    await latency();
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (!email || !password)
      return apiError(400, 'Enter your work email and password.', 'VALIDATION');
    const user = demoUserFor(email);
    if (!user)
      return apiError(
        401,
        'Those details are not right. Check your work email and password.',
        'INVALID_CREDENTIALS',
      );
    store.set(CHALLENGE, user);
    return HttpResponse.json({ challengeId: 'challenge-1' });
  }),

  http.post(api(ENDPOINTS.auth.staffVerify), async ({ request }) => {
    await latency();
    const { code } = (await request.json()) as { code: string };
    const user = store.get<StaffUser | null>(CHALLENGE, null);
    if (!user) return apiError(401, 'Your sign-in expired. Start again.', 'CHALLENGE_EXPIRED');
    if (code === '000000') return apiError(403, 'Sign-in refused outside the hub.', 'OUTSIDE_HUB');
    if (!/^\d{6}$/.test(code))
      return apiError(
        400,
        'That code is not right. Check the authenticator and try again.',
        'INVALID_CODE',
      );
    store.set(SESSION, user);
    store.remove(CHALLENGE);
    return HttpResponse.json(user);
  }),

  http.get(api(ENDPOINTS.auth.me), async () => {
    await latency();
    const user = store.get<StaffUser | null>(SESSION, null);
    return user ? HttpResponse.json(user) : apiError(401, 'Please sign in.', 'UNAUTHENTICATED');
  }),

  http.post(api(ENDPOINTS.auth.unlock), async ({ request }) => {
    await latency();
    const { password } = (await request.json()) as { password: string };
    return password
      ? new HttpResponse(null, { status: 204 })
      : apiError(400, 'Enter your password.', 'VALIDATION');
  }),

  http.post(api(ENDPOINTS.auth.signOut), async () => {
    store.remove(SESSION);
    return new HttpResponse(null, { status: 204 });
  }),
];
