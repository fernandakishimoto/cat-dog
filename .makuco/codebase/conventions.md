# Conventions

> Source: .makuco/architecture/tech_stack_context.md and tech_restrictions_context.md

## Naming

| Entity | Convention | Example |
|---|---|---|
| Files — React components | PascalCase | `LoginForm.tsx`, `AnimalCard.tsx` |
| Files — hooks | camelCase with `use` prefix | `useLogin.ts`, `useAnimals.ts` |
| Files — utils/services | camelCase | `authService.ts`, `validators.ts` |
| Files — NestJS modules | kebab-case | `auth.module.ts`, `auth.service.ts` |
| Types / Interfaces | PascalCase — `Type` suffix for props | `LoginFormValuesType`, `UserType` |
| Variables | camelCase | `accessToken`, `isLoading` |
| Constants | UPPER_CASE | `MIN_PASSWORD_LENGTH` |
| Functions | camelCase or PascalCase | `validateEmail`, `LoginForm` |
| i18n namespaces | UPPER_SNAKE_CASE | `AUTH_LOGIN`, `AUTH_REGISTER` |
| NestJS DTOs | PascalCase + `Dto` suffix | `LoginDto`, `CreateAnimalDto` |

## Import Order

```typescript
// 1. Node built-ins / framework (React / Next.js / NestJS)
import { Injectable } from '@nestjs/common';
import type { NextPage } from 'next';

// 2. External libraries
import { z } from 'zod';

// 3. Internal (alias @/)
import { UserType } from '@/types/user';

// 4. Local (relative ./)
import { loginSchema } from './schemas';
```

Rule: use `@/` for all imports outside the current directory. Never use `../../` for shared code.

## TypeScript

- No `any` — ever. Use explicit types, generics, or `unknown`.
- Explicit return types on non-trivial functions.
- Props types use `Type` suffix: `LoginFormPropsType`.
- NestJS DTOs validated with class-validator decorators.
- Frontend validation schemas defined with Zod.

## Formatting (ESLint)

- 2-space indentation.
- Semicolons always.
- Max line: 120 characters (URLs/strings/template literals exempt).
- No implicit coercion: use `Boolean()`, `Number()`, `String()`.

## React / Next.js Rules

| Rule | What to do instead |
|---|---|
| No inline styles | Use CSS Modules (`.module.css`) or Tailwind utility classes |
| No `console.log` | Use `console.warn` for debug; NestJS Logger for backend |
| No hardcoded user-visible strings | Use `t()` from react-i18next |
| No `&&` with falsy values | Use ternary: `{count ? <View /> : null}` |
| No array index as `key` | Use stable unique IDs |

## NestJS Rules

- Always apply `ValidationPipe` globally — no manual DTO validation in services.
- Never return Supabase internal error messages to the client — map to domain errors.
- `ConfigModule` for all environment variables — no `process.env` access outside config.
- One module per domain; each module self-contained.

## Security

- Never hardcode tokens, secrets, or API keys.
- Sensitive data only via environment variables (`ConfigModule`).
- Tokens never in localStorage — prefer httpOnly cookies or in-memory.
- Backend CORS restricted to frontend origin only.
