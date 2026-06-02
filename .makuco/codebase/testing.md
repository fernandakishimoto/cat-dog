# Testing

> Source: CLAUDE.md (parent directory). Greenfield — no tests written yet. This documents the mandatory approach.

## Framework

| Tool | Role |
|---|---|
| Jest | Test runner + assertions |
| @testing-library/react-native | Component rendering + queries |
| userEvent (@testing-library/react-native) | User interaction simulation |

## Test Location

Co-located with source files:
- Components: `ComponentName.spec.tsx` next to `ComponentName.tsx`
- Hooks: `useHookName.spec.ts` next to `useHookName.ts`
- Utils: `helperName.spec.ts` next to `helperName.ts`
- Services: `test-utils.ts` co-located in the service folder (mock setup)

## Naming Convention

```
ComponentName.spec.tsx
useHookName.spec.ts
utilityName.spec.ts
```

Test case names: `it('should [expected behavior] when [condition]', ...)`

## File Structure

```typescript
// 1. Mocks at the top
jest.mock('some-module');

// 2. Reusable defaultProps
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

## Query Priority

Prefer in this order:
1. `getByRole`
2. `getByText`
3. `getByLabelText`
4. `getByTestId` (last resort — requires `testID` prop on element)

## Mocking Rules

- Native libraries (expo-secure-store, Camera, Firebase, Notifee) are always mocked.
- HTTP services: mock co-located in `test-utils.ts` next to the service.
- `jest.clearAllMocks()` in every `beforeEach`.

## Coverage Target

Per spec quality gate: minimum 80% coverage on modified/created classes.

## What Is Not Tested Here

- E2E tests: not defined for MVP.
- Visual regression: not defined for MVP.
