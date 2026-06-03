# Architecture

> Source: .makuco/architecture/architecture_definition_context.md

## Pattern

Monorepo with two independent services — Next.js frontend and NestJS backend — deployed separately.
Backend is organized by domain module; each module owns its controller, service, and repository.
No microservices, no message queues — intentionally simple for MVP.

## Monorepo Services

```
cat-dog/
├── services/frontend/   # Next.js web app (App Router)
└── services/backend/    # NestJS REST API
```

## Backend Layer Map (`services/backend`)

```
HTTP Request
  └── NestJS Guard (JWT verification via Supabase Auth)
       └── Controller (route handler — validates DTO, delegates to service)
            └── Service (business logic)
                 └── Repository (Supabase SDK calls — DB, storage)
```

- **Modules**: one per domain in `src/modules/[domain]/`. Each module self-contains its controller, service, repository, and DTOs.
- **Guards**: `JwtAuthGuard` uses `supabase.auth.getUser(token)` to verify tokens — no separate JWT library.
- **DTOs**: defined with class-validator decorators; ValidationPipe applied globally.
- **Common**: shared guards, interceptors, decorators, and pipes live in `src/common/`.

## Frontend Layer Map (`services/frontend`)

```
Next.js Page (src/app/[route]/page.tsx)
  └── Feature Component (src/features/[domain]/components/)
       ├── React Hook Form (form state + Zod validation)
       └── HTTP Service (src/http/ — Axios calls to backend)
```

- **App Router**: pages and layouts in `src/app/`. Route groups: `(auth)`, `(adotante)`, `(admin)`.
- **Features**: domain-scoped logic in `src/features/[domain]/` — components, hooks, and validators.
- **Protected routes**: middleware in `src/middleware.ts` checks auth state; redirects unauthenticated users to login.

## Authentication

- Supabase Auth issues access tokens (short-lived, ~15 min) and refresh tokens (~7 days).
- Frontend stores tokens in httpOnly cookies (set by backend) or memory — never localStorage.
- Backend verifies every request via `supabase.auth.getUser(accessToken)`.
- Token refresh handled transparently by frontend interceptor on 401 response.
- Roles (`admin`, `adotante`) embedded in token metadata; checked by `RolesGuard` in backend.

## State Management

- Server state: React Server Components + `fetch` (no extra library needed for most data).
- Client state: React `useState`/`useContext` for UI state; no Redux in MVP.
- Auth state: stored in cookie and read server-side for SSR.

## Communication

- Frontend calls `services/backend` REST API exclusively — no direct Supabase calls from frontend.
- Backend is the single source of truth for data access.
