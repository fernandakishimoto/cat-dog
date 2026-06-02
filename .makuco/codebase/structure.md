# Structure

> Source: CLAUDE.md (parent directory) — greenfield project. Directory tree is the intended target structure, not yet scaffolded.

## Monorepo Layout

```
cat-dog/
├── services/
│   ├── frontend/    # React Native + Expo mobile app
│   └── backend/     # API server (stack TBD)
└── .makuco/         # Makuco planning artifacts
```

## Frontend Source Tree (`services/frontend/src/`)

```
src/
├── components/        # Reusable design system components (shared across features)
├── features/          # Domain-scoped screens, local hooks, local components
│   └── [feature]/
│       ├── screens/
│       ├── hooks/
│       └── components/
├── hoc/               # Higher-Order Components
│   └── withPropsInjection.tsx   # Injects services into screens for testability
├── hooks/             # Global custom hooks (useAppDispatch, useAppSelector, etc.)
├── http/              # HTTP services per domain
│   └── interceptors/  # Axios interceptors (auth headers, token refresh)
├── navigation/        # Navigator definitions and route types
│   └── types.tsx      # All route param types — always use, never `any`
├── network/           # HTTP adapter interface and implementations
│   └── IHttpAdapter.ts
├── redux/             # Store, slices (ducks), thunks
│   ├── ducks/         # Slice files — one per domain
│   ├── thunks/        # Async thunks
│   └── store.ts       # Redux store + redux-persist config
├── theme/             # Theme tokens per app variant
├── translations/      # i18n files
│   └── pt.json        # Single PT-BR translation file, keyed by namespace
├── utils/             # Pure utility functions
│   ├── formatter/     # Data formatting helpers
│   ├── mask/          # Input mask helpers
│   ├── validator/     # Form validation functions (used by React Final Form)
│   └── Storage/       # SecureStore + AsyncStorage wrapper
└── whiteLabel/        # WhiteLabelController + per-app config
```

## Key Structural Rules

- Feature-local components live in `features/[feature]/components/`, not in `src/components/`.
- `src/components/` is for shared, reusable design system primitives only.
- Tests are co-located: `ComponentName.spec.tsx` next to `ComponentName.tsx`.
- Route param types are centralized in `~/navigation/types.tsx`.
- Services are singletons exported from the bottom of their file.
