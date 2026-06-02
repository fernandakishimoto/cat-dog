# Architecture

> Source: CLAUDE.md (parent directory) — greenfield project. Patterns defined by convention, not yet in code.

## Pattern

Feature-sliced / domain-driven layering inside a single React Native app.
Each domain lives under `src/features/[domain]/` and owns its screens, local hooks, and local components.
Global concerns (Redux store, HTTP adapters, navigation, theme) live in top-level directories.

## Layer Map

```
Screen (features/[domain]/screens/)
  └── withPropsInjection HOC (injects service dependencies)
       └── Feature hook (features/[domain]/hooks/)
            ├── Redux slice (redux/ducks/)  ←→  Redux thunk (redux/thunks/)
            │                                        └── HTTP Service (http/)
            │                                               └── AxiosHttpAdapter (network/)
            └── React Final Form (form state + validation from utils/validator/)
```

## State Management

- **Redux Toolkit** with ducks pattern: one slice per domain in `redux/ducks/`.
- **redux-persist** persists the store; sensitive slices (auth tokens) are NOT in the whitelist — stored via `expo-secure-store` instead.
- Global hooks `useAppDispatch` and `useAppSelector` (typed) wrap `react-redux` hooks — never import from `react-redux` directly.
- Thunks in `redux/thunks/` handle async operations (API calls → dispatch actions).

## HTTP Layer

- Services extend `HttpService` and use `AxiosHttpAdapter`.
- Axios instance is configured with interceptors in `~/http/interceptors/` (handles auth headers and token refresh).
- Error detection: `isResponseError` from `~/network/IHttpAdapter`.
- Services exported as singletons.

## Navigation

- React Navigation v6.
- All route param types centralized in `~/navigation/types.tsx`.
- Route params carry only IDs — screens fetch full data from Redux or API.
- Nested navigators use `NavigatorScreenParams`.

## Component Architecture

- Screens receive services via `withPropsInjection` HOC for testability.
- Components that access theme tokens export default wrapped in `withTheme` HOC.
- Components > ~150 lines are candidates for extraction.

## Whitelabel

- Behavioral differences: `WhiteLabelController` (`~/whiteLabel/`).
- Visual differences: theme tokens via `@callstack/react-theme-provider`.
- No app-name conditionals outside `~/whiteLabel/`.

## Roles and Access (Auth Domain)

Two roles in MVP: `admin` and `adotante`.
- Role-based routing: after login, redirect to role-specific navigator.
- Protected routes: check auth state in navigation layer; redirect to Login if unauthenticated.
- Token strategy: short-lived access token + longer-lived refresh token, both stored via `~/utils/Storage` (encrypted).
