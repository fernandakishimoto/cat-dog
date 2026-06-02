# Integrations

> Source: CLAUDE.md + spec_context.md for auth feature. Greenfield — no integrations are yet implemented.

## Mobile Storage

| Service | Library | Usage |
|---|---|---|
| Secure storage | expo-secure-store | Tokens, passwords, PII — via `~/utils/Storage` wrapper |
| Async storage | @react-native-async-storage/async-storage | Non-sensitive persistent data |

## HTTP

| Service | Library | Usage |
|---|---|---|
| REST API client | Axios | All HTTP calls via `AxiosHttpAdapter`; interceptors in `~/http/interceptors/` |
| Backend API | CatDog backend (TBD) | Auth, animals, adoption requests |

## Email Transactional (Planned — Backend)

| Service | Status | Usage |
|---|---|---|
| Email provider (TBD) | Pending definition | Account confirmation email (CatDog-branded: paw print background, orange/purple colors, logo) |

## CI/CD

> Not yet defined. No pipeline configured.

## Environment Variables

> Not yet defined. `.env.example` does not exist yet. Expected variables (to be confirmed):
> - `API_BASE_URL` — backend API base URL per environment

## Notes

- No payment integrations in MVP scope.
- No push notifications, SMS, or in-app messaging in MVP scope.
- No social login (Google, Facebook, etc.) in MVP scope.
- No multi-organization support in MVP scope.
