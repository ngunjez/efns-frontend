import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import { documentsByService, hubs, services } from '../data/catalogue';
import { api, latency } from '../utils';
import type { TimeSlot } from '@/types/domain';

const TIMES = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
];

export const catalogueHandlers = [
  http.get(api(ENDPOINTS.catalogue.services), async () => {
    await latency();
    return HttpResponse.json(services);
  }),
  http.get(api(ENDPOINTS.catalogue.hubs), async () => {
    await latency();
    return HttpResponse.json(hubs);
  }),
  http.get(api(ENDPOINTS.catalogue.slots), async ({ request }) => {
    await latency();
    const day = new Date(new URL(request.url).searchParams.get('date') ?? Date.now()).getDate();
    const slots: TimeSlot[] = TIMES.map((time, index) => ({
      time,
      available: (index + day) % 4 !== 0,
    }));
    return HttpResponse.json(slots);
  }),
  http.post(api(ENDPOINTS.appointments.list), async ({ request }) => {
    await latency();
    const body = (await request.json()) as {
      serviceId: string;
      hubId: string;
      date: string;
      time: string;
    };
    const service = services.find((item) => item.id === body.serviceId);
    return HttpResponse.json({
      code: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      service: service?.name ?? 'Service',
      hub: hubs.find((item) => item.id === body.hubId)?.name ?? 'Hub',
      date: body.date ?? new Date().toISOString().slice(0, 10),
      time: body.time,
      documents: documentsByService[body.serviceId] ?? ['National ID or passport'],
    });
  }),
];
