# CatDog — Backend

NestJS + TypeScript + Supabase.

## Pré-requisitos

- Node.js >= 18
- Yarn
- [Supabase CLI](https://supabase.com/docs/guides/cli) (apenas para rodar migrations)

## Configuração

Crie o arquivo `.env` na raiz de `services/backend/`:

```env
PORT=3001
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
FRONTEND_URL=http://localhost:3000
```

As chaves do Supabase estão disponíveis em **Project Settings → API** no dashboard do Supabase.

## Instalação

```bash
yarn install
```

## Rodando em desenvolvimento

```bash
yarn start:dev
```

A API estará disponível em [http://localhost:3001](http://localhost:3001).

## Migrations

As migrations ficam em `db/migrations/` e são executadas via Supabase CLI.

**Primeira vez (linkar projeto):**

```bash
supabase login
yarn db:link
```

**Rodar migrations pendentes:**

```bash
yarn db:migrate
```

## Outros comandos

| Comando | Descrição |
|---|---|
| `yarn build` | Compila o projeto |
| `yarn start:prod` | Inicia em modo produção (requer build) |
| `yarn test` | Roda os testes |
| `yarn test:coverage` | Roda os testes com cobertura |
| `yarn ts:check` | Verifica erros de TypeScript sem compilar |
