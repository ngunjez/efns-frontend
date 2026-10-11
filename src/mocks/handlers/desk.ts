import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import type { StaffUser } from '@/types/auth';
import { PERMISSIONS } from '@/config/permissions';
import {
  appointments,
  floorboard,
  floorHost,
  hall,
  notifications,
  station,
  support,
  workbench,
} from '../data/desk';
import { customerDisplay } from '../data/customer-display';
import { api, latency, store } from '../utils';

const ok = () => new HttpResponse(null, { status: 204 });

export const deskHandlers = [
  http.get(api(ENDPOINTS.desk.hubStatus), () =>
    HttpResponse.json({ hubName: 'Nairobi CBD Hub', clientsInHub: 23 }),
  ),

  http.get(api(ENDPOINTS.appointments.list), async () => {
    await latency();
    return HttpResponse.json({ dateLabel: 'Today, Friday 2 October 2026', items: appointments });
  }),
  http.post(api(ENDPOINTS.appointments.checkIn(':id')), async ({ params }) => {
    await latency();
    const appointment = appointments.find((item) => item.id === params.id);
    const ticket = `B-0${51 + appointments.indexOf(appointment!)}`;
    if (appointment)
      Object.assign(appointment, {
        status: { label: `Checked in, ${ticket}`, tone: 'success' },
        canCheckIn: false,
      });
    return HttpResponse.json({ ticket });
  }),

  http.get(api(ENDPOINTS.desk.clientLookup), async ({ request }) => {
    await latency();
    const query = new URL(request.url).searchParams.get('query') ?? '';
    return HttpResponse.json(
      query.replace(/\s/g, '').startsWith('0722')
        ? { found: true, name: 'Wanjiru Maina', reference: 'CLI-2026-003377' }
        : { found: false },
    );
  }),

  http.get(api(ENDPOINTS.desk.visits), async () => {
    await latency();
    return HttpResponse.json(floorHost);
  }),
  http.post(api(ENDPOINTS.desk.priorityOverride), async () => {
    await latency();
    return HttpResponse.json({ ticket: 'P-009' });
  }),

  http.get(api(ENDPOINTS.desk.station), async () => {
    await latency();
    return HttpResponse.json(station());
  }),
  http.post(api(ENDPOINTS.desk.stationAction(':action')), async () => {
    await latency();
    return HttpResponse.json(station());
  }),
  http.post(api(ENDPOINTS.desk.stationStatus), ok),

  http.get(api(ENDPOINTS.desk.floorboard), async () => {
    await latency();
    return HttpResponse.json(floorboard);
  }),
  http.post(api(ENDPOINTS.desk.floorboardAction(':action')), ok),

  // The QA Reviewer sees the QA step of the same case; everyone else the verification step.
  http.get(api(ENDPOINTS.desk.workbench), async () => {
    await latency();
    const user = store.get<StaffUser | null>('staff-session', null);
    return HttpResponse.json(
      workbench(user?.permissions.includes(PERMISSIONS.casesQa) ? 'qa' : 'verify'),
    );
  }),
  http.post(api(ENDPOINTS.desk.caseAction(':id')), async () => {
    await latency();
    return ok();
  }),

  http.get(api(ENDPOINTS.desk.notifications), () => HttpResponse.json(notifications)),

  http.get(api(ENDPOINTS.desk.support(':id')), async () => {
    await latency();
    return HttpResponse.json(support);
  }),
  http.post(api(`${ENDPOINTS.desk.support(':id')}/:action`), async () => {
    await latency();
    return ok();
  }),

  http.get(api(ENDPOINTS.displays.hall), () => HttpResponse.json(hall)),
  http.get(api(ENDPOINTS.displays.bay(':bay')), ({ params }) =>
    HttpResponse.json({ bay: String(params.bay), ticket: 'B-047' }),
  ),
  http.get(api(ENDPOINTS.displays.customer), async () => {
    await latency();
    return HttpResponse.json(customerDisplay);
  }),
  // Simulates the gateway: an M-Pesa request confirms after a moment.
  http.post(api(ENDPOINTS.displays.customerAction), async ({ request }) => {
    await latency();
    const { step, action } = (await request.json()) as { step: string; action: string };
    const invoice = customerDisplay.data.invoice;
    if (step === 'payment' && action === 'request-payment' && invoice) {
      invoice.state = 'verifying';
      setTimeout(() => (invoice.state = 'confirmed'), 3000);
    }
    if (step === 'biometrics' && action === 'retake' && customerDisplay.data.biometrics) {
      Object.assign(customerDisplay.data.biometrics, { attempts: [38, 41, 44] });
    }
    if (step === 'biometrics' && action === 'approve-override' && customerDisplay.data.biometrics) {
      Object.assign(customerDisplay.data.biometrics, {
        issue: null,
        attempts: null,
        captured: '9 of 10 captured, override approved',
        lowest: '71, right middle',
      });
    }
    return ok();
  }),
];
