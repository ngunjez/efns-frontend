import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import { logisticsState } from '../data/logistics';
import { api, latency } from '../utils';

const settings = new Map<string, Record<string, unknown>>([
  [
    'sign-in',
    {
      idleMinutes: 15,
      lockoutAttempts: 5,
      sessionHours: 10,
      outsideHours: false,
      retentionYears: 7,
      biometricRetentionDays: 90,
      maskClientData: true,
    },
  ],
  ['notification-channels', { sms: true, email: true, inApp: true, retries: 3 }],
]);

export const settingsHandlers = [
  http.get(api(ENDPOINTS.settings(':key')), async ({ params }) => {
    await latency();
    return HttpResponse.json(settings.get(String(params.key)) ?? {});
  }),
  http.put(api(ENDPOINTS.settings(':key')), async ({ params, request }) => {
    await latency();
    settings.set(String(params.key), (await request.json()) as Record<string, unknown>);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(api(ENDPOINTS.logistics.openManifest), async () => {
    await latency();
    return HttpResponse.json(logisticsState().manifest);
  }),
  http.post(api(ENDPOINTS.logistics.scan), async ({ request }) => {
    await latency();
    const { code } = (await request.json()) as { code: string };
    const state = logisticsState();
    const next =
      state.manifest?.items.find(
        (item) => !item.scanned && (item.register === code || item.item.includes(code)),
      ) ?? state.manifest?.items.find((item) => !item.scanned);
    if (next) next.scanned = true;
    return HttpResponse.json(state.manifest);
  }),
  http.post(api(ENDPOINTS.logistics.handover), async () => {
    await latency();
    logisticsState().manifest = null;
    return new HttpResponse(null, { status: 204 });
  }),
];
