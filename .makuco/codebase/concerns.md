# Concerns

> Source: CLAUDE.md + spec_context.md. Greenfield — patterns are defined by convention, not yet in code.

## Authentication & Authorization

- **Strategy**: JWT — short-lived access token (suggested: 15 min) + longer-lived refresh token (suggested: 7 days).
- **Storage**: Both tokens stored via `~/utils/Storage` with `{ encrypted: true }` (expo-secure-store). Never AsyncStorage.
- **Token refresh**: Handled transparently in Axios interceptors (`~/http/interceptors/`). On 401 → use refresh token → retry. If refresh expired → redirect to Login.
- **Roles**: `admin` and `adotante`. Role embedded in token; reverified on every refresh.
- **Route protection**: Navigation layer checks auth state; unauthenticated users redirected to Login screen.
- **Role-based navigation**: After login, route to role-specific navigator (`adotante` → adoption area; `admin` → admin panel).

## Validation

- **Forms**: React Final Form with externalized validators in `~/utils/validator/`.
- **Auth rules**: email format, password ≥ 8 chars, name ≥ 2 chars, password confirmation match.
- **Error messages**: All visible strings via i18n (`~/translations/pt.json`). Zero hardcoded user-visible strings.

## Internationalization (i18n)

- **Library**: react-i18next.
- **Language**: PT-BR only (MVP).
- **File**: `src/translations/pt.json` — single file, organized by namespace.
- **Namespaces**: one per feature screen (e.g., `AUTH_LOGIN`, `AUTH_REGISTER`).
- **Scope**: All labels, placeholders, error messages, accessibility labels, toasts, and success/error feedback must use `t()`.

## Error Handling

- HTTP errors detected via `isResponseError` from `~/network/IHttpAdapter`.
- User-facing error messages via i18n keys, never raw API error strings.
- Security rule (RN-04 in spec): login/register errors must not reveal whether an email exists in the system.

## Security

- No `console.log` — only `console.warn`.
- No hardcoded API keys, tokens, or secrets anywhere in code.
- Sensitive data exclusively through `~/utils/Storage` encrypted path.
- Password confirmation link tokens: single-use, time-limited (24h suggested).
- No user enumeration via error messages.

## Performance

- `useCallback` for all callbacks passed as props or used in lists.
- `useMemo` for heavy computations.
- `renderItem` and `keyExtractor` in FlatList/DefaultList always extracted and memoized.
- Form `subscription` option used to limit re-renders to subscribed fields only.

## Theming

- Token-based via `@callstack/react-theme-provider`.
- CatDog identity: primary purple (~#7B2D8B), accent orange, light gray background, paw print watermark.
- No inline styles anywhere — StyleSheet.create or style hooks only.
- Whitelabel behavioral differences via `WhiteLabelController`; visual differences via theme tokens only.

## Logging

- Only `console.warn` permitted. `console.log` is prohibited.
- No structured logging library defined for mobile yet.
