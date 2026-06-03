# Integrations

> Source: .makuco/architecture/tech_stack_context.md

## Supabase

| Service | Library | Usage |
|---|---|---|
| Supabase Database | @supabase/supabase-js | Relational data — animals, users, adoption requests via PostgreSQL |
| Supabase Auth | @supabase/supabase-js | User registration, login, JWT issuance and verification |
| Supabase Storage | @supabase/supabase-js | Animal photo uploads and retrieval |

### Supabase Client (Backend)

The backend initializes a single Supabase client via `ConfigModule` using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The service role key gives full access — used only server-side; never exposed to the frontend.

### Auth verification flow

On every authenticated request, the backend calls `supabase.auth.getUser(accessToken)` inside `JwtAuthGuard`. The user's `id` and `role` metadata are then injected via `@CurrentUser()` decorator into controllers.

## HTTP

| Service | Library | Usage |
|---|---|---|
| REST API client (frontend) | Axios | All frontend-to-backend HTTP calls via a configured Axios instance |

## Email Transactional

| Service | Status | Usage |
|---|---|---|
| Email provider | Pending definition | Account confirmation email; CatDog-branded (paw print background, orange/purple, logo) |

Supabase Auth can be configured to send confirmation emails natively; custom SMTP or a provider like Resend/SendGrid can be configured if visual customization is required.

## CI/CD

> Not yet defined. No pipeline configured.

## Environment Variables

### Backend (`services/backend/.env`)

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, never exposed) |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `PORT` | HTTP server port (default: 3001) |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend (`services/frontend/.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Notes

- No payment integrations in MVP scope.
- No push notifications, SMS, or in-app messaging in MVP scope.
- No social login (Google, Facebook, etc.) in MVP scope.
- No multi-organization support in MVP scope.
