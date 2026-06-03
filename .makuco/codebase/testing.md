# Testing

> Source: .makuco/architecture/tech_stack_context.md

## Frameworks

### Backend (`services/backend`)

| Tool | Role |
|---|---|
| Jest | Test runner + assertions |
| @nestjs/testing | Module testing utilities (`Test.createTestingModule`) |
| Supertest | HTTP integration tests on NestJS controllers |

### Frontend (`services/frontend`)

| Tool | Role |
|---|---|
| Jest + jest-environment-jsdom | Test runner + browser-like environment |
| @testing-library/react | Component rendering + queries |
| @testing-library/user-event | User interaction simulation |
| @testing-library/jest-dom | Custom matchers (`.toBeInTheDocument()`, etc.) |

## Test Location

Co-located with source files:
- Components: `ComponentName.spec.tsx` next to `ComponentName.tsx`
- Hooks: `useHookName.spec.ts` next to `useHookName.ts`
- Utils / validators: `fileName.spec.ts` next to `fileName.ts`
- NestJS services: `auth.service.spec.ts` next to `auth.service.ts`
- NestJS controllers: `auth.controller.spec.ts` next to `auth.controller.ts`

## Naming Convention

```
ComponentName.spec.tsx       # Frontend component
useHookName.spec.ts          # Frontend hook
auth.service.spec.ts         # NestJS service
auth.controller.spec.ts      # NestJS controller
validators.spec.ts           # Validation schemas
```

Test case names: `it('should [expected behavior] when [condition]', ...)`

## File Structure

```typescript
// 1. Mocks at the top (Jest)
jest.mock('@/http/authService');

// 2. Reusable setup
const defaultProps = { ... };

describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should [expected behavior] when [condition]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Query Priority (React Testing Library)

Prefer in this order:
1. `getByRole`
2. `getByText`
3. `getByLabelText`
4. `getByTestId` (last resort — use `data-testid` attribute)

## Mocking Rules

- HTTP services: mock the Axios instance or the service module.
- Supabase client: always mocked in unit tests; use `jest.mock('@supabase/supabase-js')`.
- `jest.clearAllMocks()` in every `beforeEach`.
- NestJS integration tests: use `TestingModule` with real providers or mocked dependencies.

## Coverage Target

Minimum 80% coverage (branches, functions, lines, statements) on modified/created files.

## What Is Not Tested Here

- E2E tests: not defined for MVP.
- Visual regression: not defined for MVP.
- Load/performance tests: not defined for MVP.
