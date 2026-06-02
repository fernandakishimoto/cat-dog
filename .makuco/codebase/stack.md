# Stack

> Source: CLAUDE.md (parent directory) — greenfield project, no package.json yet.

## Runtime

| Layer | Technology | Version / Notes |
|---|---|---|
| Language | TypeScript | Strict — no `any` |
| Mobile framework | React Native | Via Expo managed workflow |
| Build toolchain | Expo | Managed workflow |
| Node.js | Node.js | Version not yet locked |

## Frontend (Mobile — `services/frontend`)

| Category | Library | Role |
|---|---|---|
| UI framework | React Native | Core mobile UI primitives |
| State management | Redux Toolkit | Global state, ducks pattern |
| State persistence | redux-persist | Persists auth/session slices (whitelist controlled) |
| Navigation | React Navigation v6 | Stack, tab, nested navigators |
| Forms | React Final Form | Form state + field-level validation |
| HTTP client | Axios | Via `AxiosHttpAdapter` + interceptors |
| i18n | react-i18next | PT-BR only (pt.json) |
| Theme | @callstack/react-theme-provider | Whitelabel token-based theming |
| Secure storage | expo-secure-store | Wrapped by `~/utils/Storage` |
| Async storage | AsyncStorage | Non-sensitive data only |

## Backend (`services/backend`)

> Not yet defined. Stack to be determined when backend scaffolding begins.

## Tooling

| Tool | Purpose |
|---|---|
| ESLint | Linting — `import-helpers/order-imports`, `react-hooks/exhaustive-deps` |
| Jest | Unit and component testing |
| @testing-library/react-native | Component testing utilities |
| TypeScript compiler | Type checking |

## Path Aliases

| Alias | Resolves to |
|---|---|
| `~/` | `src/` |
