# CatDog — Frontend

Next.js 15 + TypeScript + Supabase SSR.

## Pré-requisitos

- Node.js >= 18
- Yarn

## Configuração

Crie o arquivo `.env.local` na raiz de `services/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Instalação

```bash
yarn install
```

## Rodando em desenvolvimento

```bash
yarn dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Outros comandos

| Comando | Descrição |
|---|---|
| `yarn build` | Gera build de produção |
| `yarn start` | Inicia o servidor de produção (requer build) |
| `yarn lint` | Roda o ESLint |
| `yarn test` | Roda os testes |
| `yarn test:coverage` | Roda os testes com cobertura |
| `yarn ts:check` | Verifica erros de TypeScript sem compilar |
