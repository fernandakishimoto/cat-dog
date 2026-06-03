# Structure

> Source: .makuco/architecture/architecture_definition_context.md

## Monorepo Layout

```
cat-dog/
├── services/
│   ├── frontend/    # Next.js web app (App Router)
│   └── backend/     # NestJS REST API
└── .makuco/         # Makuco planning artifacts
```

## Frontend Source Tree (`services/frontend/src/`)

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Route group — login and register (no layout wrapper)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (adotante)/         # Route group — adopter area (protected)
│   │   └── layout.tsx      # Adopter layout wrapper
│   ├── (admin)/            # Route group — admin area (protected)
│   │   └── layout.tsx      # Admin layout wrapper
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root redirect (→ login if unauthenticated)
├── components/             # Shared UI components (design system primitives)
├── features/               # Domain-scoped feature logic
│   └── [domain]/
│       ├── components/     # Feature-local components
│       ├── hooks/          # Feature-local hooks
│       └── validators/     # Zod schemas for this feature
├── http/                   # Axios API client and interceptors
│   └── interceptors/       # Token refresh interceptor
├── hooks/                  # Global custom hooks
├── middleware.ts            # Next.js middleware — auth route protection
├── types/                  # Shared TypeScript types
├── translations/           # i18n files
│   └── pt.json             # Single PT-BR file, namespaced by feature
└── utils/                  # Pure utility functions
    └── validators/         # Shared validation schemas (reused across features)
```

## Backend Source Tree (`services/backend/src/`)

```
src/
├── modules/                # One module per domain
│   ├── auth/               # Authentication and authorization
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/            # Request/response DTOs for auth
│   ├── animals/            # Animal CRUD and status management
│   └── adoption/           # Adoption request flow
├── common/                 # Cross-cutting concerns
│   ├── guards/             # JwtAuthGuard, RolesGuard
│   ├── decorators/         # @Roles(), @CurrentUser()
│   └── pipes/              # Global ValidationPipe setup
├── config/                 # ConfigModule — type-safe env vars
│   └── configuration.ts
├── app.module.ts           # Root module — imports all domain modules
└── main.ts                 # Bootstrap — global pipes, CORS, versioning
```

## Key Structural Rules

- Feature-local components live in `features/[domain]/components/`, not in `src/components/`.
- `src/components/` is for shared, reusable UI primitives only.
- Tests are co-located: `FileName.spec.ts(x)` next to `FileName.ts(x)`.
- Backend domain modules are self-contained; cross-module dependencies go through services only.
- Route param types and API contract types live in `src/types/`.
