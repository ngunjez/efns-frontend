import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import type { CustomField, RegisterRow } from '@/types/register';
import { registerSeeds } from '../data/registers';
import { api, apiError, latency, paginate } from '../utils';

const tables = new Map<string, RegisterRow[]>(
  Object.entries(registerSeeds).map(([key, seed]) => [
    key,
    seed.rows.map((row, index) => ({ id: `${key}-${index + 1}`, ...row })),
  ]),
);

const customFields = new Map<string, CustomField[]>([
  [
    'hub-applications',
    [
      {
        name: 'franchisePartner',
        label: 'Franchise partner',
        type: 'select',
        required: false,
        options: ['None', 'Huduma Partners', 'County Desk'],
        showInTable: false,
      },
    ],
  ],
  [
    'accreditation',
    [
      {
        name: 'countyApproval',
        label: 'County government approval ref.',
        type: 'text',
        required: false,
        showInTable: false,
      },
    ],
  ],
  [
    'corrective-actions',
    [
      {
        name: 'linkedNcr',
        label: 'Linked non-conformance',
        type: 'text',
        required: false,
        showInTable: false,
      },
    ],
  ],
  [
    'fees',
    [
      {
        name: 'statute',
        label: 'Statute reference',
        type: 'text',
        required: false,
        showInTable: false,
      },
    ],
  ],
  [
    'procurement',
    [
      {
        name: 'tender',
        label: 'Tender reference',
        type: 'text',
        required: false,
        help: 'Not required below KES 3,000,000',
        showInTable: false,
      },
    ],
  ],
]);

const list = (key: string) => {
  if (!tables.has(key)) tables.set(key, []);
  return tables.get(key)!;
};

const register = (key: string) => api(ENDPOINTS.registers(key).list);

export const registerHandlers = [
  http.get(register(':key'), async ({ params, request }) => {
    await latency();
    const key = String(params.key);
    return HttpResponse.json({
      ...paginate(list(key), new URL(request.url)),
      summary: registerSeeds[key]?.summary,
    });
  }),

  http.post(register(':key'), async ({ params, request }) => {
    await latency();
    const values = (await request.json()) as Record<string, unknown>;
    const row: RegisterRow = { id: crypto.randomUUID(), ...values };
    list(String(params.key)).unshift(row);
    return HttpResponse.json(row, { status: 201 });
  }),

  http.patch(api(ENDPOINTS.registers(':key').detail(':id')), async ({ params, request }) => {
    await latency();
    const rows = list(String(params.key));
    const index = rows.findIndex((row) => row.id === params.id);
    if (index < 0) return apiError(404, 'That record no longer exists.', 'NOT_FOUND');
    rows[index] = { ...rows[index]!, ...((await request.json()) as Record<string, unknown>) };
    return HttpResponse.json(rows[index]);
  }),

  http.delete(api(ENDPOINTS.registers(':key').detail(':id')), async ({ params }) => {
    await latency();
    const rows = list(String(params.key));
    tables.set(
      String(params.key),
      rows.filter((row) => row.id !== params.id),
    );
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(api(`${ENDPOINTS.registers(':key').detail(':id')}/:action`), async () => {
    await latency();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(api(ENDPOINTS.customFields(':page')), async ({ params }) => {
    await latency();
    return HttpResponse.json(customFields.get(String(params.page)) ?? []);
  }),

  http.post(api(ENDPOINTS.customFields(':page')), async ({ params, request }) => {
    await latency();
    const field = (await request.json()) as Omit<CustomField, 'name'>;
    const saved: CustomField = {
      ...field,
      name: field.label
        .replace(/\W+(.)?/g, (_, next: string | undefined) => (next ? next.toUpperCase() : ''))
        .replace(/^./, (c) => c.toLowerCase()),
    };
    customFields.set(String(params.page), [
      ...(customFields.get(String(params.page)) ?? []),
      saved,
    ]);
    return HttpResponse.json(saved, { status: 201 });
  }),

  http.patch(api(ENDPOINTS.customField(':page', ':name')), async ({ params, request }) => {
    await latency();
    const page = String(params.page);
    const update = (await request.json()) as Partial<CustomField>;
    const fields = (customFields.get(page) ?? []).map((field) =>
      field.name === params.name ? { ...field, ...update, name: field.name } : field,
    );
    customFields.set(page, fields);
    return HttpResponse.json(fields.find((field) => field.name === params.name));
  }),

  http.delete(api(ENDPOINTS.customField(':page', ':name')), async ({ params }) => {
    await latency();
    const page = String(params.page);
    customFields.set(
      page,
      (customFields.get(page) ?? []).filter((field) => field.name !== params.name),
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
