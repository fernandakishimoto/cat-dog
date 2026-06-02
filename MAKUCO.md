# MAKUCO.md

## What is CatDog?

CatDog is a React Native + Expo mobile app for a single animal adoption NGO.
It replaces manual processes (Facebook groups, WhatsApp) with a centralized platform for admins to manage animals and adoption requests, and for adopters to browse and request adoptions.
Two roles in MVP: `admin` and `adotante`. Stack: TypeScript, Redux Toolkit, React Navigation v6, React Final Form, react-i18next, @callstack/react-theme-provider.

## Tech Stack

- React Native + Expo (managed workflow)
- TypeScript (no `any`)
- Redux Toolkit + redux-persist (ducks pattern)
- React Navigation v6
- React Final Form
- Axios via `AxiosHttpAdapter` + interceptors
- react-i18next (PT-BR only, `pt.json`)
- @callstack/react-theme-provider (whitelabel tokens)
- expo-secure-store via `~/utils/Storage` (encrypted token storage)

## Architecture

- Entry: `services/frontend/src/` — greenfield, not yet scaffolded
- Features: `src/features/[domain]/` — owns screens, local hooks, local components
- State: Redux slices in `src/redux/ducks/`, thunks in `src/redux/thunks/`
- HTTP: services extend `HttpService`, use `AxiosHttpAdapter`, singletons exported from file bottom
- Navigation: types in `~/navigation/types.tsx` — always use, never `any`
- Screens: receive services via `withPropsInjection` HOC
- Theme: components using tokens export default wrapped in `withTheme` HOC

## Code Rules

- Path alias `~/` → `src/`. Never use `../../` for shared code.
- No inline styles — use `StyleSheet.create` or style hooks.
- No arrow functions in JSX props — extract + `useCallback`.
- No `&&` with falsy values — use ternary.
- `testID` required on interactive elements; `accessibilityLabel` on icon-only buttons.
- Never import `useDispatch`/`useSelector` from `react-redux` — use `useAppDispatch`/`useAppSelector`.
- Sensitive data only through `~/utils/Storage` with `{ encrypted: true }`.
- No `console.log` — only `console.warn`.
- Zero hardcoded user-visible strings — all via `t()` from react-i18next.

## Design System

CatDog identity: primary purple (~#7B2D8B), accent orange, light gray background with paw print watermark.
No design system library — uses @callstack/react-theme-provider for token-based theming.
Components > ~150 lines are candidates for extraction.

## Key Patterns

- Services are singletons; HTTP errors checked via `isResponseError` from `~/network/IHttpAdapter`
- Form validators externalized to `~/utils/validator/` — never inline in JSX
- i18n namespaces per feature screen: `AUTH_LOGIN`, `AUTH_REGISTER`, etc.
- Tests co-located as `ComponentName.spec.tsx`; Jest + @testing-library/react-native
- Whitelabel: behavior via `WhiteLabelController`, visuals via theme tokens only — no app-name conditionals outside `~/whiteLabel/`
