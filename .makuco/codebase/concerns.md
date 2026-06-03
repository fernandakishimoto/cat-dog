# Concerns

> Source: .makuco/architecture/architecture_definition_context.md + spec_context.md

## Authentication & Authorization

- **Provider**: Supabase Auth — handles registration, login, JWT issuance, email confirmation.
- **Tokens**: access token (short-lived, ~15 min) + refresh token (~7 days).
- **Storage**: tokens stored in httpOnly cookies set by the backend; never localStorage.
- **Token refresh**: frontend Axios interceptor catches 401 → calls refresh endpoint → retries original request transparently.
- **Roles**: `admin` and `adotante`. Role embedded in Supabase Auth user metadata; read via `supabase.auth.getUser()`.
- **Backend verification**: every protected request goes through `JwtAuthGuard`, which calls `supabase.auth.getUser(token)`.
- **Role enforcement**: `RolesGuard` + `@Roles()` decorator on controllers/handlers. Unauthorized → `403 Forbidden`.
- **Route protection (frontend)**: `src/middleware.ts` checks auth cookie; redirects unauthenticated users to `/login`.
- **Role-based redirect**: after login, backend returns user role → frontend redirects to `/adotante` or `/admin` area.

## Validation

- **Backend**: `ValidationPipe` applied globally with `whitelist: true` and `forbidNonWhitelisted: true`. All input validated via class-validator DTOs.
- **Frontend**: Zod schemas per feature in `src/features/[domain]/validators/`; integrated with React Hook Form via `@hookform/resolvers/zod`.
- **Auth rules**: email format, password ≥ 8 chars, name ≥ 2 chars, password confirmation match.
- **Error messages**: all user-visible strings via i18n. Zero hardcoded PT-BR strings in JSX.

## Internationalization (i18n)

- **Library**: react-i18next.
- **Language**: PT-BR only (MVP).
- **File**: `src/translations/pt.json` — single file, namespaced by feature (e.g., `AUTH_LOGIN`, `AUTH_REGISTER`).
- **Scope**: all labels, placeholders, error messages, success feedback, and accessibility labels use `t()`.

## Error Handling

- **Backend**: NestJS `ExceptionFilter` formats all errors as `{ statusCode, message }`. Internal Supabase errors never surfaced raw.
- **Frontend**: Axios error interceptor maps HTTP errors to i18n keys; displays via `useFormContext` or a toast/notification.
- **Security (RN-04)**: login and register errors must never reveal whether an email exists in the system.

## Security

- No `console.log` — use `console.warn` in frontend; `Logger` from `@nestjs/common` in backend.
- No hardcoded API keys, tokens, or secrets anywhere in code.
- Backend CORS restricted to `FRONTEND_URL` env variable.
- Rate limiting on auth endpoints (implementation TBD — `@nestjs/throttler`).
- Supabase service role key is server-only; never returned to the client.
- Passwords hashed by Supabase Auth — backend never stores or receives plain passwords.
- File uploads validated for type and size before Supabase Storage persistence.

## Performance

- Use React Server Components (RSC) by default in Next.js; add `"use client"` only when necessary.
- Data fetching: prefer RSC with `fetch()` over client-side data fetching where SSR is possible.
- Client-side queries: use `SWR` or `React Query` when real-time or client-side refresh is needed.

## Logging

- Frontend: `console.warn` only. No `console.log`.
- Backend: NestJS `Logger` service for structured logging. No direct `console.*` calls in modules.
