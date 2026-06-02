# TASK-FRONTEND-001 — Login and Register screens (UI + form logic)

**Root**: `services/frontend/src/`
**Branch**: `feature/TASK-FRONTEND-001-login-register-screens`
**Spec**: `.makuco/specs/module_001_autenticacao/feature_001_auth_login_registro/spec_context.md`
**Part**: 1 of 3 — UI, form logic, and local validators
**Generated**: `2026-06-02`

---

## Context

Implement the Login and Register screens for the CatDog app, covering UI structure, form validation, and Redux wiring. This is a greenfield codebase — no existing screens to reference; all patterns come from `MAKUCO.md` and the architecture files. Token storage, interceptors, and navigation guards are out of scope and will be handled in subsequent tasks.

---

## Scope

**In:**
- `AuthCard` shared component (white card + CatDog logo + paw print background)
- `PasswordInput` feature component (text input with show/hide toggle)
- `LoginScreen` with React Final Form, email + password fields, "Entrar" button, "Esqueceu sua senha?" link (disabled/navigation stub), "Não tem uma conta? Cadastre-se" footer link
- `RegisterScreen` with React Final Form, Nome + Email + Senha + Confirmar Senha fields, "Cadastrar" button, "Voltar" button
- `useLogin` and `useRegister` hooks (form submission → Redux thunk dispatch → loading state)
- `authSlice` Redux duck (loading, error, and user state)
- `authThunks` (loginThunk, registerThunk) calling `authService` and dispatching result
- `authService` HTTP singleton (POST /auth/login, POST /auth/register)
- `authValidators` pure validation functions (email format, password min 8, name min 2, password match)
- Navigation param types for Auth stack in `navigation/types.tsx`
- i18n keys for `AUTH_LOGIN` and `AUTH_REGISTER` namespaces in `translations/pt.json`

**Out:**
- Token persistence and refresh logic (TASK-FRONTEND-002)
- Navigation guards, role-based routing, and protected routes (TASK-FRONTEND-003)
- "Esqueceu sua senha?" full flow — link rendered as stub only, no navigation implemented
- Backend implementation — frontend mocks `authService` calls for unit testing only
- Email confirmation screen and confirmation token handling

---

## Ubiquitous Language

| Business Term | Code Mapping |
|---|---|
| Adotante | `role: 'adotante'` in `UserType` |
| Administrador | `role: 'admin'` in `UserType` |
| Conta | `User` entity; `AuthState` in Redux |
| Entrar (action) | `loginThunk` → `POST /auth/login` |
| Cadastrar (action) | `registerThunk` → `POST /auth/register` |

---

## Files

| Action | Path | Why (≤5 words) |
|---|---|---|
| `create` | `src/components/AuthCard/AuthCard.tsx` | shared card with logo |
| `create` | `src/components/AuthCard/AuthCard.spec.tsx` | unit tests for AuthCard |
| `create` | `src/features/auth/components/PasswordInput.tsx` | password toggle input |
| `create` | `src/features/auth/components/PasswordInput.spec.tsx` | unit tests for PasswordInput |
| `create` | `src/features/auth/screens/LoginScreen.tsx` | login form screen |
| `create` | `src/features/auth/screens/LoginScreen.spec.tsx` | unit tests for LoginScreen |
| `create` | `src/features/auth/screens/RegisterScreen.tsx` | register form screen |
| `create` | `src/features/auth/screens/RegisterScreen.spec.tsx` | unit tests for RegisterScreen |
| `create` | `src/features/auth/hooks/useLogin.ts` | login form + dispatch |
| `create` | `src/features/auth/hooks/useRegister.ts` | register form + dispatch |
| `create` | `src/redux/ducks/authSlice.ts` | auth Redux slice |
| `create` | `src/redux/thunks/authThunks.ts` | async login/register thunks |
| `create` | `src/http/authService.ts` | HTTP singleton for auth |
| `create` | `src/utils/validator/authValidators.ts` | pure form validators |
| `modify` | `src/navigation/types.tsx` | add AuthStack param types |
| `modify` | `src/translations/pt.json` | add AUTH_LOGIN, AUTH_REGISTER keys |

---

## Implementation

### `src/components/AuthCard/AuthCard.tsx` *(create)*

**Reference pattern**: No existing component — create following conventions in `MAKUCO.md` and `.makuco/codebase/conventions.md`.
**Differences from reference**:
- Props: `AuthCardPropsType` — accepts `children: React.ReactNode` only; layout and logo are fixed.
- Renders: full-screen `View` with gray background (`theme.colors.background`) and a semi-transparent paw print pattern image as absolute-positioned watermark; centered white card (`theme.colors.surface`) containing the CatDog logo image at top, then `{children}` below.
- Paw print watermark image source: `~/assets/images/paw-pattern.png` (create placeholder path — asset will be provided separately).
- CatDog logo image source: `~/assets/images/catdog-logo.png` (create placeholder path — asset will be provided separately).
- No inline styles — use `StyleSheet.create` internal to this file.
- Export default wrapped in `withTheme` HOC (`~/hoc/withTheme` or equivalent from `@callstack/react-theme-provider`).
- `testID="auth-card"` on the outer container.

### `src/features/auth/components/PasswordInput.tsx` *(create)*

**Reference pattern**: No existing component — follow conventions from `MAKUCO.md`.
**Differences from reference**:
- Props: `PasswordInputPropsType` — extends standard `TextInput` props. Required: `label: string`, `testID: string`. Controlled via `value` and `onChangeText`.
- Manages `isPasswordVisible: boolean` local state via `useState`.
- Toggle button: icon-only (`Eye` / `EyeOff` icon), `accessibilityLabel` must use `t('AUTH_LOGIN:passwordToggleLabel')` (or `AUTH_REGISTER` namespace equivalent — pass namespace as prop `i18nNamespace: string`).
- `secureTextEntry={!isPasswordVisible}` on `TextInput`.
- Toggle `onPress` handler wrapped in `useCallback`.
- No inline styles.
- Export default wrapped in `withTheme`.
- `testID` prop forwarded to the underlying `TextInput`; toggle button uses `testID="${testID}-toggle"`.

### `src/features/auth/screens/LoginScreen.tsx` *(create)*

**Reference pattern**: No existing screen — follow `MAKUCO.md` screen conventions: `withPropsInjection` HOC injects `authService`, `useLogin` hook handles all logic.
**Differences from reference**:
- Props: `LoginScreenPropsType` — receives `authService: IAuthService` via `withPropsInjection`.
- Uses `<AuthCard>` as the root layout wrapper.
- Uses `<Form>` from `react-final-form`; fields: `email` (plain `TextInput`) and `password` (`PasswordInput` component). `subscription` set to `{ submitting: true, pristine: true }` on `<Form>` to limit re-renders.
- "Esqueceu sua senha?" — renders as a `TouchableOpacity` with `testID="forgot-password-link"`, `onPress` handler is a no-op stub (`useCallback(() => undefined, [])`); does not navigate.
- "Não tem uma conta? Cadastre-se" footer: `TouchableOpacity` with `testID="go-to-register-link"`, navigates to `Register` screen via `navigation.navigate('Register')`.
- Loading state: "Entrar" button `disabled` and shows `ActivityIndicator` when `isLoading` from `useLogin` is `true`.
- Error display: when `loginError` from `useLogin` is non-null, render a `Text` below the form with `testID="login-error-message"` and `t('AUTH_LOGIN:errorGeneric')`.
- All user-visible strings via `t()` from `useTranslation('AUTH_LOGIN')`.
- Export default: `withPropsInjection(withTheme(LoginScreen), { authService })`.

### `src/features/auth/screens/RegisterScreen.tsx` *(create)*

**Reference pattern**: Same conventions as `LoginScreen.tsx` above.
**Differences from reference**:
- Props: `RegisterScreenPropsType` — receives `authService: IAuthService` via `withPropsInjection`.
- Fields: `name` (plain `TextInput`), `email` (plain `TextInput`), `password` (`PasswordInput` with `i18nNamespace="AUTH_REGISTER"`), `confirmPassword` (`PasswordInput` with `i18nNamespace="AUTH_REGISTER"`).
- "Cadastrar" button: solid purple (primary) style; disabled + `ActivityIndicator` when `isLoading` from `useRegister`.
- "Voltar" button: outlined purple (secondary) style; `onPress` calls `navigation.goBack()` wrapped in `useCallback`; `testID="back-button"`.
- Success state: when `registerSuccess` from `useRegister` is `true`, render a `Text` with `testID="register-success-message"` and `t('AUTH_REGISTER:successMessage')`. Form fields remain but button becomes disabled.
- Error display: `Text` with `testID="register-error-message"` and `t('AUTH_REGISTER:errorGeneric')` when `registerError` is non-null.
- All user-visible strings via `t()` from `useTranslation('AUTH_REGISTER')`.
- Export default: `withPropsInjection(withTheme(RegisterScreen), { authService })`.

### `src/features/auth/hooks/useLogin.ts` *(create)*

**Reference pattern**: Custom hook following `MAKUCO.md` hook conventions.
**Differences from reference**:
- Returns: `{ onSubmit, isLoading, loginError }`.
- `onSubmit` is a `useCallback`-wrapped function accepting `LoginFormValuesType` (`{ email: string; password: string }`).
- Dispatches `loginThunk(values)` via `useAppDispatch`.
- `isLoading` and `loginError` read from `authSlice` via `useAppSelector`.
- No navigation here — navigation after login is handled in TASK-FRONTEND-003.
- Cleanup: none required (thunk handles its own abort).

### `src/features/auth/hooks/useRegister.ts` *(create)*

**Reference pattern**: Same as `useLogin.ts`.
**Differences from reference**:
- Returns: `{ onSubmit, isLoading, registerError, registerSuccess }`.
- `onSubmit` accepts `RegisterFormValuesType` (`{ name: string; email: string; password: string; confirmPassword: string }`).
- Dispatches `registerThunk(values)` via `useAppDispatch`.
- `registerSuccess: boolean` from `authSlice` — set to `true` when thunk fulfills.

### `src/redux/ducks/authSlice.ts` *(create)*

**Reference pattern**: Redux Toolkit `createSlice` with ducks pattern. No existing slice to reference — follow conventions from `.makuco/codebase/architecture.md`.
**Differences from reference**:
- State shape: `AuthStateType` — `{ user: UserType | null; isLoading: boolean; loginError: string | null; registerError: string | null; registerSuccess: boolean; }`.
- `UserType`: `{ id: string; name: string; email: string; role: 'admin' | 'adotante'; }`.
- Handles `loginThunk` and `registerThunk` pending/fulfilled/rejected cases.
- On `loginThunk.fulfilled`: set `user`, clear `loginError`, set `isLoading: false`.
- On `registerThunk.fulfilled`: set `registerSuccess: true`, clear `registerError`, set `isLoading: false`.
- On rejected: set respective error field with `action.payload as string`; keep `user: null` for login failure.
- `resetAuthErrors` action exported to clear error/success state between attempts.
- Do NOT add `isLoading` or error fields to redux-persist whitelist.

### `src/redux/thunks/authThunks.ts` *(create)*

**Reference pattern**: `createAsyncThunk` pattern per `.makuco/codebase/architecture.md`.
**Differences from reference**:
- `loginThunk`: calls `authService.login(credentials)`. On `isResponseError`, dispatches rejected with `'AUTH_LOGIN:errorGeneric'` i18n key string as payload. On success, returns `UserType`.
- `registerThunk`: calls `authService.register(payload)`. On `isResponseError` with 409 (email already taken), payload is `'AUTH_REGISTER:errorGeneric'` (RN-04 — do not reveal email existence). Other errors: `'AUTH_REGISTER:errorGeneric'` too. On success, returns `void`.
- Both thunks use `rejectWithValue(i18nKey)` — the slice stores the i18n key; screens translate with `t(error)`.

### `src/http/authService.ts` *(create)*

**Reference pattern**: HTTP service singleton pattern from `.makuco/codebase/architecture.md` — extends `HttpService`, uses `AxiosHttpAdapter`.
**Differences from reference**:
- Methods: `login(credentials: LoginCredentialsType): Promise<LoginResponseType>` → POST `/auth/login`. `register(payload: RegisterPayloadType): Promise<void>` → POST `/auth/register`.
- `LoginCredentialsType`: `{ email: string; password: string }`.
- `LoginResponseType`: `{ user: UserType; accessToken: string; refreshToken: string }`.
- `RegisterPayloadType`: `{ name: string; email: string; password: string }` — never include `confirmPassword`.
- Token storage from `LoginResponseType` is NOT handled here — thunk passes tokens up; token persistence is in TASK-FRONTEND-002.
- Error check: `if (isResponseError(error)) { throw error; }`.
- Export singleton: `export const authService = new AuthService(axiosHttpAdapter);` at file bottom.

### `src/utils/validator/authValidators.ts` *(create)*

**Reference pattern**: Pure functions, no side effects. Check existing validators in `~/utils/validator/` before creating — if `validateEmail` exists, re-export it; add only what is missing.
**Differences from reference**:
- `validateEmail(value: string): string | undefined` — returns `'AUTH_LOGIN:validationEmailFormat'` if invalid, `undefined` if valid.
- `validateRequired(value: string): string | undefined` — returns `'AUTH_LOGIN:validationRequired'` if blank/undefined.
- `validatePasswordLength(value: string): string | undefined` — returns `'AUTH_LOGIN:validationPasswordMinLength'` if `value.length < 8`.
- `validateNameLength(value: string): string | undefined` — returns `'AUTH_REGISTER:validationNameMinLength'` if `value.length < 2`.
- `validatePasswordMatch(password: string): (value: string) => string | undefined` — factory returning validator that returns `'AUTH_REGISTER:validationPasswordMatch'` if `value !== password`.
- All validators return an i18n key string (not the translated string) — React Final Form renders the error, screen translates with `t(meta.error)`.

### `src/navigation/types.tsx` *(modify)*

**Changes**:
- Add `AuthStackParamList` type: `{ Login: undefined; Register: undefined; }`.
- Do not modify any existing navigator types.

### `src/translations/pt.json` *(modify)*

**Changes** — add the following namespaces alongside any existing keys:

```json
"AUTH_LOGIN": {
  "emailLabel": "Email",
  "emailPlaceholder": "Digite seu email",
  "passwordLabel": "Senha",
  "passwordPlaceholder": "Digite sua senha",
  "passwordToggleLabel": "Mostrar senha",
  "forgotPasswordLink": "Esqueceu sua senha?",
  "submitButton": "Entrar",
  "goToRegisterLink": "Não tem uma conta? Cadastre-se",
  "errorGeneric": "Email ou senha inválidos. Verifique os dados e tente novamente.",
  "errorUnconfirmed": "Sua conta ainda não foi confirmada. Verifique seu email ou solicite o reenvio.",
  "validationRequired": "Este campo é obrigatório.",
  "validationEmailFormat": "Informe um endereço de email válido.",
  "validationPasswordMinLength": "A senha deve ter no mínimo 8 caracteres."
},
"AUTH_REGISTER": {
  "nameLabel": "Nome",
  "namePlaceholder": "Digite seu nome completo",
  "emailLabel": "Email",
  "emailPlaceholder": "Digite seu email",
  "passwordLabel": "Senha",
  "passwordPlaceholder": "Crie uma senha",
  "confirmPasswordLabel": "Confirmar a Senha",
  "confirmPasswordPlaceholder": "Repita a senha",
  "passwordToggleLabel": "Mostrar senha",
  "submitButton": "Cadastrar",
  "backButton": "Voltar",
  "errorGeneric": "Não foi possível criar a conta. Verifique os dados informados.",
  "successMessage": "Conta criada! Enviamos um email de confirmação. Verifique sua caixa de entrada.",
  "validationRequired": "Este campo é obrigatório.",
  "validationEmailFormat": "Informe um endereço de email válido.",
  "validationPasswordMinLength": "A senha deve ter no mínimo 8 caracteres.",
  "validationNameMinLength": "O nome deve ter no mínimo 2 caracteres.",
  "validationPasswordMatch": "As senhas não coincidem."
}
```

---

## Acceptance Criteria

- [ ] **Given** user opens the app unauthenticated, **When** LoginScreen renders, **Then** email field, password field with toggle icon, "Entrar" button, "Esqueceu sua senha?" text, and "Não tem uma conta? Cadastre-se" link are all present in DOM.
- [ ] **Given** user taps the password toggle on LoginScreen, **When** initial state is hidden, **Then** password becomes visible (`secureTextEntry=false`); tapping again hides it (`secureTextEntry=true`).
- [ ] **Given** user submits LoginScreen with empty fields, **When** "Entrar" is tapped, **Then** form validation fires before API call and fields show `t('AUTH_LOGIN:validationRequired')` error; no network request is made.
- [ ] **Given** user submits LoginScreen with invalid email format, **When** "Entrar" is tapped, **Then** email field shows `t('AUTH_LOGIN:validationEmailFormat')`; no network request is made.
- [ ] **Given** user submits LoginScreen with valid credentials, **When** `loginThunk` is pending, **Then** "Entrar" button is disabled and shows `ActivityIndicator`.
- [ ] **Given** `loginThunk` rejects, **When** error state is set, **Then** `testID="login-error-message"` is present in DOM with `t('AUTH_LOGIN:errorGeneric')`.
- [ ] **Given** user taps "Não tem uma conta? Cadastre-se", **When** `onPress` fires, **Then** `navigation.navigate('Register')` is called.
- [ ] **Given** user taps "Esqueceu sua senha?", **When** `onPress` fires, **Then** no navigation occurs and no error is thrown (stub behavior).
- [ ] **Given** user opens RegisterScreen, **When** rendered, **Then** Nome, Email, Senha, Confirmar a Senha fields (each with label), "Cadastrar" (solid purple), and "Voltar" (outlined purple) buttons are all present.
- [ ] **Given** user submits RegisterScreen with passwords that do not match, **When** "Cadastrar" is tapped, **Then** confirmPassword field shows `t('AUTH_REGISTER:validationPasswordMatch')`; no network request is made.
- [ ] **Given** user submits RegisterScreen with name shorter than 2 characters, **When** "Cadastrar" is tapped, **Then** name field shows `t('AUTH_REGISTER:validationNameMinLength')`; no network request is made.
- [ ] **Given** user submits RegisterScreen with password shorter than 8 characters, **When** "Cadastrar" is tapped, **Then** password field shows `t('AUTH_REGISTER:validationPasswordMinLength')`; no network request is made.
- [ ] **Given** user submits RegisterScreen with all valid fields, **When** `registerThunk` is pending, **Then** "Cadastrar" button is disabled and shows `ActivityIndicator`.
- [ ] **Given** `registerThunk` fulfills, **When** `registerSuccess` is `true`, **Then** `testID="register-success-message"` is present in DOM with `t('AUTH_REGISTER:successMessage')`.
- [ ] **Given** `registerThunk` rejects, **When** error state is set, **Then** `testID="register-error-message"` is present in DOM with `t('AUTH_REGISTER:errorGeneric')`.
- [ ] **Given** user taps "Voltar" on RegisterScreen, **When** `onPress` fires, **Then** `navigation.goBack()` is called.
- [ ] `AuthCard` renders `testID="auth-card"`; logo image and paw pattern image are present as child elements.
- [ ] `authService.login` sends `POST /auth/login` with `{ email, password }` only — no `confirmPassword` in body.
- [ ] `authService.register` sends `POST /auth/register` with `{ name, email, password }` only — `confirmPassword` never sent to API.
- [ ] `loginThunk` and `registerThunk` never call `console.log`; `console.warn` is allowed.
- [ ] All user-visible strings in both screens use `t()` — zero hardcoded PT-BR strings in JSX.

---

## API Notes

- **Login endpoint**: `POST /auth/login`
  - **Input**: `{ email: string; password: string }`
  - **Success**: `200` — `{ user: UserType; accessToken: string; refreshToken: string }`
  - **Errors**: `401` — invalid credentials or unconfirmed account; `400` — validation error
- **Register endpoint**: `POST /auth/register`
  - **Input**: `{ name: string; email: string; password: string }`
  - **Success**: `201` — `{}` (empty body; confirmation email dispatched server-side)
  - **Errors**: `409` — email already in use (treat as generic per RN-04); `400` — validation error

---

## Dependencies

- **Requires**: none — this is the first implementation task for the auth module.
- **Blocks**: TASK-FRONTEND-002 (token persistence and Axios interceptors — needs `authService` and `authSlice`); TASK-FRONTEND-003 (navigation guards — needs `AuthStackParamList` and `authSlice` user/role state).
