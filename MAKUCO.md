# MAKUCO.md

## What is CatDog?

CatDog is a web platform for a single animal adoption NGO.
It replaces manual processes (Facebook groups, WhatsApp) with a centralized platform where admins manage animals and adoption requests, and adopters browse and request adoptions.
Two roles in MVP: `admin` and `adotante`.
Stack: TypeScript, NestJS (backend), Next.js (frontend), Supabase (database, auth, storage).

## Tech Stack

- Frontend: Next.js (App Router), TypeScript
- Backend: NestJS, TypeScript
- Database: Supabase PostgreSQL (via Supabase SDK)
- Auth: Supabase Auth (JWT — access token ~15 min + refresh token ~7 days)
- Storage: Supabase Storage (animal photos)
- Package manager: Yarn
- Testing: Jest + @testing-library/react (frontend), Jest + @nestjs/testing (backend)

## Architecture

- Monorepo: `services/frontend` (Next.js) + `services/backend` (NestJS) — deployed independently
- Frontend: App Router pages in `src/app/`, domain logic in `src/features/[domain]/`
- Backend: one NestJS module per domain in `src/modules/[domain]/` — controller → service → repository pattern
- Auth: Supabase Auth issues JWTs; backend verifies via `supabase.auth.getUser(token)` in `JwtAuthGuard`
- Frontend calls backend REST API exclusively — no direct Supabase calls from frontend

## Code Rules

- No `any` in TypeScript — explicit types always
- Path alias `@/` → `src/` in both services
- Backend validation: class-validator DTOs + global `ValidationPipe`
- Frontend validation: Zod schemas integrated with React Hook Form
- Never hardcode tokens, secrets, or API keys — use environment variables via `ConfigModule`
- No `console.log` — `console.warn` in frontend; `Logger` from `@nestjs/common` in backend
- Zero hardcoded user-visible strings — all via `t()` from react-i18next
- Tests co-located as `FileName.spec.ts(x)` — minimum 80% coverage

## Design System

CatDog identity: primary purple (~#7B2D8B), accent orange, light gray background with paw print watermark.
No external component library defined — use CSS Modules. Logo: orange cat + "CatDog" text.

## Key Patterns

- i18n namespaces per feature screen: `AUTH_LOGIN`, `AUTH_REGISTER`, etc. — file: `src/translations/pt.json`
- Validation schemas centralized per feature in `src/features/[domain]/validators/`
- Auth errors must not reveal email existence (RN-04)
- Route groups in Next.js: `(auth)`, `(adotante)`, `(admin)` — each with its own layout
- Middleware in `src/middleware.ts` handles auth route protection and role-based redirects
