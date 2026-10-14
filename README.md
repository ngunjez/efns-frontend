# Agency Service Hubs — Frontend

Next.js frontend for the Agency Service Hubs platform: the public site and client portal, the in-hub **Service Desk**, the client-facing hub screens and wall displays, and the network **Admin** console. Built to the Frontend Developers Handbook; the backend (Elixir/Phoenix + PostgreSQL) is consumed purely through HTTP endpoints.

Until the endpoints land, every API call is answered by mock handlers (MSW) that follow the same contract, so the whole workflow is clickable today.

## Quick start

```bash
# Node 20.9+ (22 recommended, see .nvmrc) and pnpm
npm install -g pnpm
pnpm install
cp .env.example .env.local      # optional: with no API URL set, the app runs on the mocks
pnpm dev                        # http://localhost:3000
```

### Demo accounts (mock mode)

Staff sign-in is at `/staff/sign-in`. There is one sign-in for every staff role; the role decides the screens. Any password works, and any 6-digit code works except `000000`, which shows the outside-hub refusal (frame 81). An email that is not on the list is refused.

| Email (any domain)   | Role                   | Lands on                        | Can also open                                      |
| -------------------- | ---------------------- | ------------------------------- | -------------------------------------------------- |
| `mary.njoki@…`       | Floor host             | `/desk/floor-host`              |                                                    |
| `mary.achieng@…`     | Reception              | `/desk/appointments`            | Document check (`/desk/reception`)                 |
| `grace.mwangi@…`     | Service officer, Bay 3 | `/desk/service-point`           | Case console (`/desk/service-point/case`)          |
| `joseph.kariuki@…`   | Verification officer   | `/desk/workbench`               |                                                    |
| `rose.auma@…`        | QA reviewer            | `/desk/workbench`               |                                                    |
| `wanjiku.kamau@…`    | Hub manager            | `/desk/floorboard`              | Overrides, reassignment, journey board, exceptions |
| `wambui.gathoni@…`   | Support agent          | `/desk/support`                 |                                                    |
| `samuel.kiprop@…`    | Vault custodian        | `/admin/vault`                  | Check in, stock-take                               |
| `peter.otieno@…`     | Despatch clerk         | `/admin/logistics`              |                                                    |
| `faith.njeri@…`      | Finance                | `/admin/finance/reconciliation` |                                                    |
| `hassan.omar@…`      | Operations manager     | `/admin/analytics/performance`  | Hubs, suspensions, exceptions                      |
| `david.mutua@…`      | Service owner          | `/admin/services/forms`         |                                                    |
| `lydia.chebet@…`     | HR                     | `/admin/agents/certification`   |                                                    |
| `lilian.abeno@…`     | Compliance             | `/admin/compliance/quality`     |                                                    |
| `achieng.odhiambo@…` | Customer experience    | `/admin/analytics/feedback`     |                                                    |
| `njeri.mwangi@…`     | Platform administrator | `/admin/network`                | Settings, assets                                   |

A user with both apps gets an "Open Service Desk / Open AaaS Admin" switch in the user menu.

**Client side:** sign in at `/sign-in` after creating an account. Tracking links: `/track/AAS-2026-004812`, `/track/AAS-2026-004812-Q` (one more document requested) and `/track/AAS-2026-004812-R` (ready to collect).

**A live case, end to end:** sign in as `grace.mwangi`, open _Service Point_ and choose _Start filing_. The officer console drives the case step by step (check details, consent, capture, flag a document problem, biometrics with retake and manager override, M-Pesa prompt or provisional receipt, vault check-in, submission). Open `/hub/display` in a second window: it is the client's screen and follows the case on its own. Reception does the same with `mary.achieng` at _Document check_. Wall displays: `/display/hall`, `/display/bay/3`.

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

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui pattern on Radix · TanStack Query (server state) · Redux Toolkit (session and UI state) · Axios · Zod + React Hook Form · next-intl · Motion (Framer Motion) · next-themes · Recharts · MSW · Jest/RTL · Playwright.

Nothing else was added. There is no Vite: Next.js builds the app.

## Structure

```
src/
├── app/                      Routes only — thin pages that render feature components
│   ├── (site)/               Public site and client portal: landing, sign-in, create-account, book, my-application, track
│   ├── staff/                Staff sign-in (password + authenticator) and the outside-hub refusal
│   ├── desk/                 Service Desk: appointments, reception, floor-host, service-point (+ case console), workbench, floorboard, support, journey-board
│   ├── hub/                  Client-facing hub screens: /hub/display follows the live case, /hub/[step] previews one step
│   ├── display/              Hall and bay wall displays
│   ├── admin/[...slug]/      Every admin register, rendered from its page definition
│   └── api/auth/             Sign-in routes the browser calls; they forward to the identity service
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
├── i18n/                     Language registry, negotiation (cookie, then browser) and loader
├── mocks/                    MSW handlers and fixtures mirroring the designs, grouped by backend service
├── server/identity/          Server-only sign-in code: calls the identity service, reads tokens, keeps the session cookies
├── store/                    Redux store: auth (user, permissions, lock) and UI
├── types/                    Domain and API contract types
└── proxy.ts                  First-line route guard for staff areas (Next 16 "proxy", formerly middleware)
messages/                     One catalogue per language (12 today) — client-facing copy
scripts/identity-check.mjs    Checks the real identity service from the command line
```

## How it is built to avoid repetition

- **One navigation config** (`src/config/navigation.ts`) drives the sidebar, the per-screen permission guard and the post-sign-in landing page.
- **Admin pages are data.** Each register is a `PageDefinition` (`src/config/pages/admin/*`): header stats, side KPI cards, widgets (bar chart, donut, meters, lists, tiles, checklist), the table columns, the add/edit drawer form, row actions (including actions that need input, such as dual sign-off) and the delete confirmation. `RegisterPage` renders all 25 of them. A new register is one definition object and one nav link.
- **Forms are data.** `DynamicForm` builds layout, controls, Zod validation and server-error mapping from field definitions. Custom fields added in _Settings › Modules and fields_ are appended to forms and, optionally, to tables automatically.
- **One table.** `DataTable` handles declarative cells (money, status enums with tone maps, progress, people, entities), search, column visibility, selection, row actions, pagination and empty/error states.
- **One mutation policy.** Success toasts, error toasts and cache invalidation are declared in each hook's `meta` and handled once in the providers.
- **One journey table.** `src/config/journey.ts` maps each client-facing step to its stage of 12, what the officer and the client each see, and which steps belong to the reception, filing and collection flows.

## Languages, theme and motion

- **Languages:** English, Kiswahili, French, Spanish and Portuguese for everything a client sees (`messages/*.json`). The choice is kept in a cookie and sent to the API as `Accept-Language`, so catalogue data can come back translated too. A test fails if any language misses a key or a `{placeholder}`.
- **Theme:** light and dark on every screen, following the device setting until the user picks one with the sun/moon button.
- **Motion:** Motion's `LazyMotion` keeps the bundle small, and every animation respects the device's reduce-motion setting. Content reveals once on arrival; live lists (queues, called tickets, notifications) animate only the items that are added or removed when data refreshes, so polling never replays animations.
- **Loading:** every route has a skeleton (`loading.tsx`), data views show skeletons shaped like their content, charts load on demand, and scanned documents fade in over a skeleton.

## Design system

Tokens live in `src/app/globals.css` (semantic names only — `bg-primary`, `text-muted-foreground`, `bg-success-tint` — with a dark theme). Typography and page spacing are **fluid** with `clamp()`: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`, `text-ticket`, `text-jumbo`, `px-gutter`, `py-section`. They scale smoothly from a 360px phone to a 1440px desktop without breakpoint overrides. The Outfit font is self-hosted because hub networks have no public internet breakout.

## Languages

Twelve languages ship today: English, Kiswahili, French, German, Spanish, Portuguese, Italian, Arabic (right to left), Chinese, Japanese, Hindi and Russian. The first visit uses the browser's language when it is supported; the choice in the language menu is kept in a cookie. Dates and numbers follow the chosen language, and every API call sends it as `Accept-Language` so the backend can localise service names.

To add a language:

1. Add one line to `src/i18n/languages.ts` (code, English name, native name, `ltr` or `rtl`, Intl locale).
2. Copy `messages/en.json` to `messages/<code>.json` and translate the values. Keep `{placeholders}` and the ICU plural shape.
3. Run `pnpm test`. It checks that the catalogue has every key and placeholder. Any key left out falls back to English at runtime.

## Staff sign-in (identity service)

The browser never calls the identity service directly. It calls this app's own routes under `/api/auth/*`, and the Next.js server forwards each call to the identity service. That keeps tokens in httpOnly cookies that page scripts cannot read, avoids CORS, works with the development server's self-signed certificate, and forwards the client's IP so the backend can still refuse sign-ins from outside a hub.

| Browser calls                  | Server forwards to (under `IDENTITY_API_URL`)                                           |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `POST /api/auth/login`         | `POST /auth/login` (`username`, `password`) and gets `mfa_required` + `mfa_token`       |
| `POST /api/auth/verify`        | `POST /auth/verify-otp` (`mfa_token`, `totp`), then `GET /api/v1/me` for name and roles |
| `GET /api/auth/session`        | nothing; reads the session cookie                                                       |
| `POST /api/auth/unlock`        | `POST /auth/token` (`username`, `password`, `totp`) from the lock screen                |
| `POST /api/auth/logout`        | `POST /auth/logout` with the bearer token                                               |
| `GET /api/auth/callback?code=` | `GET /auth/callback?code=`                                                              |

The paths live in `src/api/endpoints/index.ts` (`ENDPOINTS.auth` for the browser, `ENDPOINTS.identity` for the backend). There is no `/identity` prefix: the identity service answers on `/auth/*` and `/api/v1/*` directly. A change of host is a one-line change to `IDENTITY_API_URL` in `.env.local`.

**To sign in against the real identity service** while everything else stays on mock data, put this in `.env.local` and restart `pnpm dev`:

```bash
NEXT_PUBLIC_USE_MSW=true
NEXT_PUBLIC_LIVE_SERVICES=identity
IDENTITY_API_URL=https://192.168.30.17:4000
IDENTITY_CLIENT_ID=hub-portal
IDENTITY_TLS_INSECURE=true
```

`IDENTITY_TLS_INSECURE=true` accepts a self-signed certificate. Use it only against a development server, never in production. `NEXT_PUBLIC_LIVE_SERVICES` takes a comma-separated list (`identity,desk,registers`), so each backend module can go live on its own as it is delivered.

**Check the identity service on its own** before opening the app:

```bash
pnpm identity:check
pnpm identity:check --username nbo.service_officer.01 --password 'Test-ms2w-4d4y-mPhn' --totp 123456
```

The first run checks that the endpoints answer and reject bad input. The second signs in, completes the MFA step, reads the profile and roles from `/api/v1/me` and signs out again. On staging any 6-digit code is accepted; in production it is the code from the user's authenticator app. Tokens and passwords are masked in its output.

**Roles to screens.** After sign-in, the user's screens come from the role names in `GET /api/v1/me` (for example `service_officer`, `cashier`, `vault_custodian`), or from the roles in the access token if that call fails. Names match `src/config/roles.ts` in any spelling (`PLATFORM_ADMIN`, `platform-admin`, `ROLE_PLATFORM_ADMIN`), and a `permissions` claim with values such as `vault:manage` is honoured as well. Hub and station come from `hub_id`/`hub_name` (or a `hub` object) and `station`. A user whose token carries none of these can sign in but sees no screens.

## Connecting the real API

1. Set `NEXT_PUBLIC_API_BASE_URL`, then either list the modules that are ready in `NEXT_PUBLIC_LIVE_SERVICES` or set `NEXT_PUBLIC_USE_MSW=false` to turn every mock off.
2. Compare each path in `src/api/endpoints/index.ts` with the backend's OpenAPI spec and adjust there only.
3. The response shapes the screens expect are the types in `src/types/*` (and the mock fixtures in `src/mocks/data` are worked examples). Where the backend differs, adapt in the hook's `queryFn` rather than in components.
4. Errors should follow `{ code, message, fieldErrors? }` (OAuth-style `{ error, error_description }` is also understood for sign-in); `401` sends staff back to sign-in and `403` with code `OUTSIDE_HUB` shows the geofence refusal.
5. Admin registers use one convention: `GET/POST /registers/:key`, `PATCH/DELETE /registers/:key/:id`, `POST /registers/:key/:id/:action`, with an optional `summary` object for the page's KPIs and widgets.

Live screens poll every 4–15 seconds today; when Phoenix Channels are specified, replace the `refetchInterval` in `use-desk.ts` / `use-displays.ts` with a channel subscription that invalidates the same query keys.

## Conventions

- Components `PascalCase.tsx`; folders `kebab-case`; `components/ui` keeps shadcn's lowercase names.
- No raw hex in components; no `useEffect` for data — use the hooks in `src/api/hooks`.
- Client-facing copy goes in `messages/` in all five languages; staff and admin copy is English, inline in config.
- No code comments: names and the README carry the intent.
- Every new route needs a nav entry with a permission, or it is open to any signed-in staff member.
- Branches: `main` (production), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`. Use the PR template.

## Not yet included (needs a decision or a backend contract)

- **Sentry:** `src/lib/monitoring.ts` is the single hook point; add `@sentry/nextjs` when a DSN is issued.
- **Store and forward:** the screens (offline banner, provisional slip, sync list) are built; the queue itself runs on the counter device and the backend must define how items replay.
- **SMS/email templates (frames 88, 100):** sent by the backend, not rendered by the frontend.

# efns-frontend
