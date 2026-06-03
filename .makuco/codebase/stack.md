# Stack

> Source: .makuco/architecture/tech_stack_context.md

## Runtime

| Layer | Technology | Version / Notes |
|---|---|---|
| Language | TypeScript | Strict — no `any` |
| Runtime | Node.js | Version TBD |
| Package manager | Yarn | Monorepo management |

## Frontend (`services/frontend`)

| Category | Library | Role |
|---|---|---|
| Framework | Next.js | Web application — App Router |
| HTTP client | Axios | REST API calls to backend |
| Forms | React Hook Form + Zod | Form state and schema validation |
| i18n | react-i18next | PT-BR translations (pt.json) |

## Backend (`services/backend`)

| Category | Library | Role |
|---|---|---|
| Framework | NestJS | API server and business logic |
| Validation | class-validator + class-transformer | DTO validation pipeline |
| Database client | @supabase/supabase-js | All DB, auth, and storage operations |

## Supabase (infrastructure)

| Service | Usage |
|---|---|
| Supabase PostgreSQL | Relational data — animals, users, adoption requests |
| Supabase Auth | User authentication and JWT issuance |
| Supabase Storage | File uploads — animal photos |

## Tooling

| Tool | Purpose |
|---|---|
| ESLint | Linting — import order, TypeScript rules |
| Jest | Unit and integration tests |
| @testing-library/react | Frontend component testing |
| @nestjs/testing | Backend unit and integration testing |
| TypeScript compiler | Type checking |

## Path Aliases

| Service | Alias | Resolves to |
|---|---|---|
| frontend | `@/` | `src/` |
| backend | `@/` | `src/` |
