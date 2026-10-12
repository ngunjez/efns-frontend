import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '@/api/endpoints';
import { journeySteps } from '@/config/journey';
import type { CustomerDisplayView, JourneyStep } from '@/types/journey';
import { customerDisplay } from '../data/customer-display';
import { arrivals } from '../data/desk';
import { api, latency } from '../utils';
import { addRecord } from './registers';

const KEY = 'mock:case';
const initial: CustomerDisplayView = structuredClone(customerDisplay);

function read(): CustomerDisplayView {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as CustomerDisplayView;
  } catch {
    return structuredClone(initial);
  }
  return structuredClone(initial);
}

function update(change: (view: CustomerDisplayView) => void) {
  const view = read();
  change(view);
  try {
    localStorage.setItem(KEY, JSON.stringify(view));
  } catch {
    return;
  }
}
const ok = () => new HttpResponse(null, { status: 204 });
const confirmOnly = new Set(['originals-returned', 'rate']);
const staysPut = new Set([
  'ask-to-change',
  'report-problem',
  'request-payment',
  'send-receipt',
  'retake',
]);

const clock = (minutesAgo = 0) =>
  new Date(Date.now() - minutesAgo * 60_000).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

function show(view: CustomerDisplayView, step: JourneyStep) {
  view.step = step;
  view.clientDone = false;
}

function confirmPayment(view: CustomerDisplayView) {
  if (!view.data.invoice) return;
  view.data.invoice.state = 'verifying';
  setTimeout(
    () => update((later) => later.data.invoice && (later.data.invoice.state = 'confirmed')),
    3000,
  );
}

const commands: Record<
  string,
  (view: CustomerDisplayView, payload: Record<string, unknown>) => void
> = {
  checklist: (view, { label, done }) => {
    const list = view.data.checklist ?? [];
    const item = list.find((entry) => entry.label === label);
    if (item) item.done = Boolean(done);
    const gap = list.find((entry) => !entry.done);
    view.data.missing = gap
      ? {
          title: `Bring your ${gap.label.toLowerCase()}`,
          detail: 'Come back to reception with it today. You keep your place in the queue.',
        }
      : null;
  },
  'open-arrival': (view, { id }) => {
    const index = arrivals.findIndex((arrival) => arrival.id === id);
    const arrival = arrivals[index];
    if (!arrival) return;
    arrivals.splice(index, 1);
    view.client = { ...view.client, name: arrival.name };
    show(view, 'documents');
  },
  'close-reception': (view) => show(view, 'documents'),
  'route-to-qa': (view) => {
    view.review = 'pending';
    setTimeout(
      () =>
        update((later) => {
          later.review = 'approved';
          show(later, 'biometrics');
        }),
      3500,
    );
  },
  retake: (view) => {
    if (view.data.biometrics) view.data.biometrics.attempts = [38, 41, 44];
  },
  'approve-override': (view, { reason }) => {
    const bio = view.data.biometrics;
    if (bio)
      Object.assign(bio, {
        issue: null,
        attempts: null,
        captured: '9 of 10 captured, override approved',
        lowest: '71, right middle',
      });
    addRecord('exceptions', {
      exception: `EXC-2026-0${413 + Math.floor(Math.random() * 80)}`,
      type: 'Biometric exemption',
      tone: 'warning',
      case: view.client.reference,
      requestedBy: view.officer,
      secondSignOff: 'Wanjiku Kamau, Hub Manager',
      reason: String(reason ?? ''),
      time: new Date().toISOString(),
      status: { label: 'Approved', tone: 'success' },
    });
  },
  'document-problem': (view, { problem, document, description }) => {
    addRecord('exceptions', {
      exception: `EXC-2026-0${500 + Math.floor(Math.random() * 80)}`,
      type: 'Document defect',
      tone: 'warning',
      case: view.client.reference,
      requestedBy: view.officer,
      secondSignOff: 'Recorded at capture',
      reason: `${String(document)}: ${String(problem)}. ${String(description)}`,
      time: new Date().toISOString(),
      status: { label: 'Recorded', tone: 'info' },
    });
  },
  'request-payment': (view) => confirmPayment(view),
  'go-offline': (view) => {
    view.offline = {
      since: new Date(Date.now() - 8 * 60_000).toISOString(),
      pending: [
        { label: 'Application form', savedAt: clock(26) },
        { label: 'Photo and fingerprints', savedAt: clock(6) },
        { label: 'Payment', savedAt: clock(0) },
      ],
    };
    show(view, 'provisional-slip');
  },
  'vault-check-in': (view) => {
    addRecord('vault', {
      item: 'Passport Z4418207',
      itemType: 'Surrendered passport',
      tone: 'warning',
      holder: view.client.name,
      application: view.client.reference,
      location: 'At Bay 3, awaiting check-in',
      lodged: new Date().toISOString(),
      custodian: 'Samuel Kiprop',
      status: { label: 'Awaiting check-in', tone: 'warning' },
    });
  },
  submit: (view) => {
    view.clientDone = true;
  },
  'close-case': (view) => {
    Object.assign(view, structuredClone(initial));
  },
};

export const caseHandlers = [
  http.get(api(ENDPOINTS.displays.customer), async () => {
    await latency();
    return HttpResponse.json(read());
  }),

  http.post(api(ENDPOINTS.displays.customerAction), async ({ request }) => {
    await latency();
    const { step, action } = (await request.json()) as { step: JourneyStep; action: string };
    update((view) => {
      if (action === 'request-payment') confirmPayment(view);
      if (step !== view.step || staysPut.has(action)) return;
      const next = journeySteps[step].next;
      if (confirmOnly.has(action) || !next) view.clientDone = true;
      else show(view, next);
    });
    return ok();
  }),

  http.post(api(ENDPOINTS.desk.caseStep), async ({ request }) => {
    await latency();
    const { step } = (await request.json()) as { step: JourneyStep };
    update((view) => show(view, step));
    return ok();
  }),

  http.post(api(ENDPOINTS.desk.caseCommand(':name')), async ({ params, request }) => {
    await latency();
    const payload = ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
    update((view) => commands[String(params.name)]?.(view, payload));
    return ok();
  }),

  http.get(api(ENDPOINTS.desk.arrivals), async () => {
    await latency();
    return HttpResponse.json(arrivals);
  }),
];
