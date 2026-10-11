# Agency Service Hubs — Frontend

Next.js frontend for the Agency Service Hubs platform: the public site and client portal, the in-hub **Service Desk**, the client-facing hub screens and wall displays, and the network **Admin** console. Built to the Frontend Developers Handbook; the backend (Elixir/Phoenix + PostgreSQL) is consumed purely through HTTP endpoints.

Until the endpoints land, every API call is answered by mock handlers (MSW) that follow the same contract, so the whole workflow is clickable today.

## Quick start

```bash
# Node 20.9+ (22 recommended, see .nvmrc) and pnpm
npm install -g pnpm
pnpm install
cp .env.example .env.local      # NEXT_PUBLIC_USE_MSW=true while there is no backend
pnpm dev                        # http://localhost:3000
```

### Demo accounts (mock mode)

Staff sign-in is at `/staff/sign-in`. Any password works, and any 6-digit code works except `000000`, which shows the outside-hub refusal (frame 81).

| Email (any domain) | Role                   | Lands on                         |
| ------------------ | ---------------------- | -------------------------------- |
| `grace.mwangi@…`   | Service Officer, Bay 3 | `/desk/service-point`            |
| `mary.achieng@…`   | Reception              | `/desk/appointments`             |
| `mary.njoki@…`     | Floor host             | `/desk/floor-host`               |
| `joseph.kariuki@…` | Verification Officer   | `/desk/workbench` (verify)       |
| `rose.auma@…`      | QA Reviewer            | `/desk/workbench` (QA)           |
| `wanjiku.kamau@…`  | Hub Manager            | Floorboard and every desk screen |
| `wambui.gathoni@…` | Support Agent          | `/desk/support`                  |
| `njeri.mwangi@…`   | Platform Administrator | Everything, including `/admin`   |

Client side: sign in at `/sign-in` with anything. Tracking links: `/track/AAS-2026-004812`, and `/track/AAS-2026-004812-Q` for the "one more document" state.

Hub screens: `/hub/welcome`, `/hub/check-details`, `/hub/consent`, `/hub/biometrics`, `/hub/payment` … (one per step in `src/config/journey.ts`). Wall displays: `/display/hall`, `/display/bay/3`.

## Scripts

| Command                | What it does                                           |
| ---------------------- | ------------------------------------------------------ |
| `pnpm dev`             | Dev server (Turbopack)                                 |
| `pnpm build` / `start` | Production build / serve                               |
| `pnpm lint`            | ESLint: Next, TypeScript, full `jsx-a11y` recommended  |
| `pnpm type-check`      | `tsc --noEmit` (strict, typed routes, typed i18n keys) |
| `pnpm test`            | Jest + React Testing Library                           |
| `pnpm test:e2e`        | Playwright, desktop and mobile                         |
| `pnpm format`          | Prettier (with Tailwind class sorting)                 |
| `pnpm build:analyze`   | Bundle analyser                                        |

Husky runs lint-staged on every commit; CI (`.github/workflows/ci.yml`) runs lint, format check, types, tests, build and e2e.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui pattern on Radix · TanStack Query (server state) · Redux Toolkit (session and UI state) · Axios · Zod + React Hook Form · next-intl · Recharts · MSW · Jest/RTL · Playwright.

Nothing else was added. There is no Vite: Next.js builds the app.

## Structure

```
src/
├── app/                      Routes only — thin pages that render feature components
│   ├── (site)/               Public site and client portal: landing, sign-in, create-account, book, my-application, track
│   ├── staff/                Staff sign-in (password + authenticator) and the outside-hub refusal
│   ├── desk/                 Service Desk: appointments, floor-host, service-point, workbench, floorboard, support, journey-board
│   ├── hub/[step]/           Client-facing hub screens, one route for all 14 steps
│   ├── display/              Hall and bay wall displays
│   └── admin/[...slug]/      Every admin register, rendered from its page definition
├── api/
│   ├── axios.ts              The single HTTP client (cookie session, error normalisation, session redirects)
│   ├── endpoints/            Every API path in one file
│   ├── query-keys.ts         Every cache key in one tree
│   └── hooks/                React Query hooks per domain, plus one generic register hook set
├── components/
│   ├── ui/                   shadcn-style primitives (owned, not a dependency)
│   ├── common/               Reusable building blocks: DataTable, DynamicForm, PageHeader, StageProgress, SignaturePad, OtpInput …
│   ├── layout/               AppShell (sidebar + top bar), StaffGuard, lock screen, site and hub headers
│   ├── features/             Smart components per domain (desk, journey, register-page, settings …)
│   └── providers/            Query, Redux, theme, toasts, mock gate, session redirects
├── config/                   env (validated), navigation + permissions, journey steps, icons, page definitions
├── hooks/                    useHasPermission, useIdleTimer, useDebouncedValue, useElapsedSeconds
├── i18n/                     Locale config (cookie based) and loader
├── mocks/                    MSW handlers and fixtures mirroring the designs
├── store/                    Redux store: auth (user, permissions, lock) and UI
├── types/                    Domain and API contract types
└── proxy.ts                  First-line route guard for staff areas (Next 16 "proxy", formerly middleware)
messages/                     en.json, sw.json — client-facing copy
```

## How it is built to avoid repetition

- **One navigation config** (`src/config/navigation.ts`) drives the sidebar, the per-screen permission guard and the post-sign-in landing page.
- **Admin pages are data.** Each register is a `PageDefinition` (`src/config/pages/admin/*`): header stats, side KPI cards, widgets (bar chart, donut, meters, lists, tiles, checklist), the table columns, the add/edit drawer form, row actions (including actions that need input, such as dual sign-off) and the delete confirmation. `RegisterPage` renders all 25 of them. A new register is one definition object and one nav link.
- **Forms are data.** `DynamicForm` builds layout, controls, Zod validation and server-error mapping from field definitions. Custom fields added in _Settings › Modules and fields_ are appended to forms and, optionally, to tables automatically.
- **One table.** `DataTable` handles declarative cells (money, status enums with tone maps, progress, people, entities), search, column visibility, selection, row actions, pagination and empty/error states.
- **One mutation policy.** Success toasts, error toasts and cache invalidation are declared in each hook's `meta` and handled once in the providers.
- **One journey table.** `src/config/journey.ts` maps each client-facing step to its stage of 12 and the next step.

## Design system

Tokens live in `src/app/globals.css` (semantic names only — `bg-primary`, `text-muted-foreground`, `bg-success-tint` — with a dark theme). Typography and page spacing are **fluid** with `clamp()`: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`, `text-ticket`, `text-jumbo`, `px-gutter`, `py-section`. They scale smoothly from a 360px phone to a 1440px desktop without breakpoint overrides. The Outfit font is self-hosted because hub networks have no public internet breakout.

## Connecting the real API

1. Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_USE_MSW=false`, and set `SESSION_COOKIE_NAME` to the httpOnly cookie the API issues at staff sign-in.
2. Compare each path in `src/api/endpoints/index.ts` with the backend's OpenAPI spec and adjust there only.
3. The response shapes the screens expect are the types in `src/types/*` (and the mock fixtures in `src/mocks/data` are worked examples). Where the backend differs, adapt in the hook's `queryFn` rather than in components.
4. Errors should follow `{ code, message, fieldErrors? }`; `401` sends staff back to sign-in and `403` with code `OUTSIDE_HUB` shows the geofence refusal.
5. Admin registers use one convention: `GET/POST /registers/:key`, `PATCH/DELETE /registers/:key/:id`, `POST /registers/:key/:id/:action`, with an optional `summary` object for the page's KPIs and widgets.

Live screens poll every 4–15 seconds today; when Phoenix Channels are specified, replace the `refetchInterval` in `use-desk.ts` / `use-displays.ts` with a channel subscription that invalidates the same query keys.

## Conventions

- Components `PascalCase.tsx`; folders `kebab-case`; `components/ui` keeps shadcn's lowercase names.
- No raw hex in components; no `useEffect` for data — use the hooks in `src/api/hooks`.
- Client-facing copy goes in `messages/` (a test fails if Kiswahili misses a key); staff and admin copy is English, inline in config.
- Every new route needs a nav entry with a permission, or it is open to any signed-in staff member.
- Branches: `main` (production), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`. Use the PR template.

## Not yet included (needs a decision or a backend contract)

- **Sentry:** `src/lib/monitoring.ts` is the single hook point; add `@sentry/nextjs` when a DSN is issued.
- **French, Spanish, Italian:** add the code to `src/i18n/config.ts` and a `messages/<code>.json`.
- **Offline capture and provisional slip (frame 35):** needs the backend's store-and-forward contract.
- **SMS/email templates (frames 88, 100):** sent by the backend, not rendered by the frontend.
