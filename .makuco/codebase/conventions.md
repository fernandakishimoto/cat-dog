# Conventions

> Source: CLAUDE.md (parent directory).

## Naming

| Entity | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `LoginScreen.tsx`, `PasswordInput.tsx` |
| Files (hooks) | camelCase with `use` prefix | `useLogin.ts`, `useAppDispatch.ts` |
| Files (utils/services) | camelCase | `authService.ts`, `emailValidator.ts` |
| Types / Interfaces | PascalCase + `Type` suffix for props | `LoginFormValuesType`, `UserType` |
| Variables | camelCase | `accessToken`, `isPasswordVisible` |
| Constants | UPPER_CASE | `MIN_PASSWORD_LENGTH` |
| Functions | camelCase or PascalCase | `validateEmail`, `LoginScreen` |
| i18n namespaces | UPPER_SNAKE_CASE | `AUTH_LOGIN`, `AUTH_REGISTER` |

## Import Order (enforced by ESLint `import-helpers/order-imports`)

```typescript
// 1. React
import React from 'react';
import { View } from 'react-native';

// 2. External libraries
import { someLib } from 'external-lib';

// 3. Internal (alias ~/)
import { Something } from '~/components/Something';

// 4. Local (relative ./)
import { localHelper } from './helper';
```

Rule: use `~/` for all imports outside the current directory. Never use `../../`.

## TypeScript

- No `any` — ever.
- Explicit return types on non-trivial functions.
- Props types use `Type` suffix: `ButtonPropsType`.

## Formatting (ESLint)

- 2-space indentation.
- Semicolons always.
- Max line: 120 characters (URLs/strings/template literals exempt).
- Arrow functions: no parens for single param, no unnecessary body.
- Max 1 blank line between blocks.
- No implicit coercion: use `Boolean()`, `Number()`, `String()`.

## React / JSX Rules

| Rule | What to do instead |
|---|---|
| No inline styles | Use `StyleSheet.create` or style hooks (`useViewStyles`, `useTextStyles`, `useImageStyles`) |
| No arrow functions in JSX props | Extract + wrap in `useCallback` |
| No `&&` with falsy values | Use ternary: `{count ? <View /> : null}` |
| No array index as `key` | Use stable unique IDs |
| No `console.log` | Use `console.warn` only |

## Component Rules

- `testID` required on interactive elements.
- `accessibilityLabel` required on icon-only buttons.
- Components > ~150 lines → split.
- Default export wrapped in `withTheme` when using theme tokens.
- Tests co-located: `ComponentName.spec.tsx`.

## Redux Rules

- Never import `useDispatch`/`useSelector` from `react-redux` directly.
- Use `useAppDispatch` and `useAppSelector` from `~/hooks/`.
- Loading states and request errors: NOT in redux-persist whitelist.

## Forms

- Validation functions externalized (never inline in JSX).
- Use validators from `~/utils/validator/` before creating new ones.
- Use `subscription` to limit re-renders.

## Security

- Never hardcode tokens, secrets, or API keys.
- Sensitive data only via `~/utils/Storage` with `{ encrypted: true }`.
- Never use `AsyncStorage` directly for sensitive data.
