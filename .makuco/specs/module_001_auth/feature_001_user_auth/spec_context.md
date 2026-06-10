# FEATURE-RF-001 — Usuário: persistência, autenticação e correção de envio de email

---

## Grupo 1 — Identificação

**Feature:** RF-001 — Usuário: persistência, autenticação e correção de envio de email
**Módulo:** module_001_auth — Autenticação e gerenciamento de usuários
**Status:** Rascunho
**Criado por:** Makuco Specify Agent — 2026-06-08
**Aprovado por:** _A preencher_

---

## Objetivo da Feature

> Em 3-5 linhas: qual problema esta feature resolve, quem se beneficia e qual o valor entregue ao negócio. É o critério de decisão para qualquer dúvida de escopo.

Esta feature cria as tabelas e fluxos necessários para persistir usuários, permitir registro e login (email+senha), gerenciar verificação de email e recuperação de senha, e diagnosticar/corrigir o problema atual de envio de emails. Beneficiários: novos usuários que precisam se registrar e autenticar, e administradores que gerenciam contas.

---

## Grupo 2 — Contexto

### Quem Acessa

> Liste exatamente os perfis ou permissões que habilitam o acesso. Termos vagos não são válidos.

| Perfil / Permissão | Nível de acesso | Observação |
|---|---|---|
| Usuário (registrado) | Escrita / Leitura | Pode criar conta, confirmar email, autenticar-se, recuperar senha |
| Administrador | Total | Pode listar usuários, forçar reenvio de confirmação, ver logs de envio |
| Serviço backend (API) | Total | Endpoints públicos e autenticados usados pelo frontend |

---

### Premissas

- Banco relacional disponível (ex.: Postgres). 
- Fluxo de autenticação por email+senha é o padrão. 
- Existe infra para variáveis de ambiente e secrets (SMTP credentials, JWT secrets). 
- Sistema de filas/worker existe ou será provisionado para envio assíncrono de emails.

---

### Dependências

| Dependência | Tipo | Status | Impacto se não resolvida |
|---|---|---|---|
| Banco de dados (Postgres preferível) | Infra | Pendente/Configurar | Não é possível persistir usuários nem tokens |
| Provedor de email (SMTP / SendGrid / SES) | Integração | Pendente/Configurar | Emails de verificação/reset não chegam ao usuário |
| Worker/Queue (ex: Bull, Sidekiq, Celery) | Infra | Pendente/Configurar | Envio assíncrono e retries indisponíveis |

---

### Referências e Insumos

**Protótipo / Wireframe:**
- ERD / diagrama: previstas tabelas `users`, `email_verifications`, `password_resets`, `sessions` (ver seção Tabelas abaixo)

**Artefatos consultados:**
- Diagrama de contexto fornecido pelo time
- Logs atuais de envio de email (para diagnóstico)

---

## Tabelas previstas (modelo físico sugerido)

- `users` (id: UUID PK, email VARCHAR(320) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, first_name, last_name, confirmed BOOLEAN DEFAULT false NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), last_login_at TIMESTAMP WITH TIME ZONE, failed_login_attempts INT DEFAULT 0, locked_until TIMESTAMP WITH TIME ZONE, role VARCHAR(50) DEFAULT 'user')
- `email_verifications` (id: UUID PK, user_id FK users.id, token VARCHAR(255) UNIQUE NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, sent_count INT DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())
- `password_resets` (id: UUID PK, user_id FK users.id, token VARCHAR(255) UNIQUE NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, used BOOLEAN DEFAULT false, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())
- `sessions` (id: UUID PK, user_id FK users.id, refresh_token_hash VARCHAR(255) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, revoked BOOLEAN DEFAULT false, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())

---

## Grupo 3 — Comportamento

### Histórias de Usuário

Cada história é testável de forma independente.

#### HU-01 — Registro (signup)

Usuário fornece email e senha e cria conta. Sistema valida dados, cria `users` com `confirmed=false`, gera token em `email_verifications` e solicita envio de email de confirmação.

Pode ser testada independentemente: Enviar POST /api/signup e verificar criação em `users` e `email_verifications`.

Cenários de aceite:
1. Dado email válido não existente, quando enviar POST /api/signup, então retorna 201 e cria `users` com `confirmed=false` e registro em `email_verifications`.
2. Dado email já cadastrado, quando enviar POST /api/signup, então retorna 409.

#### HU-02 — Login

Usuário autenticado por email+senha. Se política exigir confirmação, usuário deve estar `confirmed=true`.

Pode ser testada independentemente: POST /api/login com credenciais válidas retorna tokens.

Cenários de aceite:
1. Dado credenciais válidas e conta confirmada, quando enviar POST /api/login, então retorna 200 com `access_token`.
2. Dado credenciais inválidas, então retorna 401 e incrementa contador de falhas.

#### HU-03 — Confirmação de email

Usuário clica no link de confirmação recebido por email; sistema valida token, marca `confirmed=true` e invalida o token.

Cenários de aceite:
1. Token válido → 200 e `users.confirmed=true`.
2. Token inválido/expirado → 404/410.

#### HU-04 — Reenvio de confirmação

Usuário solicita reenvio; sistema aplica rate limit e enfileira reenvio, incrementando `sent_count`.

Cenários de aceite:
1. Reenvio dentro de limites → 200 e `email_verifications.sent_count` incrementado.
2. Excesso de reenvios → 429.

#### HU-05 — Recuperação de senha

Usuário solicita recuperação; sistema cria `password_resets` e envia email com token; reset com token válido atualiza `password_hash`.

Cenários de aceite:
1. Forgot request cria token e enfileira email (200 indistinto se email existe).
2. Reset com token válido atualiza senha e invalida sessões antigas (opcional, configurável).

---

### Regras de Negócio

- **RN-01:** Emails únicos; tentativa de registrar email existente retorna 409.
- **RN-02:** Password policy mínima: 8 caracteres com ao menos uma letra e um número (ajustável).
- **RN-03:** Tokens de verificação expiram (ex: 24h); tokens de reset expiram (ex: 1h).
- **RN-04:** Reenvio de email limitado (ex: 3 reenvios/hora, 10/dia).
- **RN-05:** Tokens single-use; após uso são invalidados.
- **RN-06:** Tentativas de login mal-sucedidas incrementam contador; após N tentativas bloqueio temporário.
- **RN-07:** Falhas no envio de email devem ser registradas e re-tentadas via job; não vazar informações sensíveis.

---

### Requisitos Funcionais

#### O que o sistema exibe ao ser acessado

Para telas de autenticação: formulário de cadastro (email, senha, nome opcional), formulário de login (email, senha), links para "Esqueci a senha" e "Reenviar confirmação".

#### Ações disponíveis

**Ação — Registrar (POST /api/signup)**

Valida input; se inválido → 400; se email existente → 409; se válido → cria `users` e `email_verifications`, enfileira email e retorna 201.

Regras condicionais:
- Se envio de email falhar no worker → registrar erro e re-tentar com backoff; resposta ao cliente permanece 201 (não bloquear criação).

**Ação — Autenticar (POST /api/login)**

Valida credenciais; se inválidas → 401; se usuário bloqueado → 429/403 conforme política; se sucesso → retorna tokens e atualiza `last_login_at`.

**Ação — Confirmar email (GET /api/email/confirm?token=)**

Valida token; se válido → marca `confirmed=true`, remove token e retorna 200.

**Ação — Reenviar confirmação (POST /api/email/resend)**

Valida rate limit; se dentro do limite → cria/renova token e enfileira envio; retorna 200.

**Ação — Recuperar senha (POST /api/password/forgot, POST /api/password/reset)**

Cria token de reset (cryptographic), enfileira email; reset atualiza `password_hash` e invalida tokens/sessions relevantes.

#### Validações e Restrições

- `email`: obrigatório, formato válido, único.
- `password`: obrigatório, mínimo 8 caracteres, ao menos 1 letra e 1 número.
- `token` (verificação/reset): obrigatório, válido, não expirado.
- Reenvio: máximo 3 reenvios/hora por usuário (configurável).

#### Mensagens ao Usuário

| Condição | Mensagem |
|---|---|
| Cadastro bem-sucedido | Conta criada. Verifique seu email para confirmar sua conta. |
| Email já cadastrado | Já existe uma conta com este email. |
| Credenciais inválidas | Email ou senha inválidos. |
| Token inválido | Link inválido. Solicite reenvio. |
| Token expirado | Link expirado. Solicite novo reenvio. |
| Reenvio bloqueado | Limite de reenvio atingido. Tente mais tarde. |

#### Integrações

| Sistema externo | O que é enviado | O que é recebido | Em caso de falha |
|---|---|---|---|
| Provedor de email externo (SMTP/API) | Email de verificação, reset | 2xx / erro com razão | Registrar falha, re-tentar via job; alertar se repetido |
| Queue/Worker (sistema de filas/worker) | Job de envio | Ack/Nack | Re-tentar com backoff; mover para DLQ se falhas repetidas |

---

### Requisitos Não Funcionais

| ID | Tipo | Requisito | Critério mensurável |
|---|---|---|---|
| RNF-01 | Segurança | Senhas armazenadas por algoritmo de hash resistente (ex.: Argon2, bcrypt) | Senhas nunca em texto; auditoria de hashes aplicada |
| RNF-02 | Disponibilidade | Enfileiramento de emails e retries | Jobs com 3 tentativas e DLQ configurada |
| RNF-03 | Performance | Login em até 500ms em ambiente normal | 95% das operações < 500ms sob carga normal |
| RNF-04 | Observabilidade | Logs estruturados com request_id | Erros rastreáveis em logs em < 24h |
| RNF-05 | Conformidade | Dados pessoais removíveis por demanda | Suporte a remoção/anonimização conforme LGPD/GDPR |

---

### O que Não Deve Ser Feito

- Não implementar autenticação por terceiros (OAuth) nesta entrega.
- Não logar senhas ou tokens completos em texto claro.

---

## Grupo 4 — Validação

### Casos de Teste

| ID | Cenário | Entrada | Resultado esperado | Tipo |
|---|---|---|---|---|
| CT-01 | Cadastro bem-sucedido | POST /api/signup com email novo e senha válida | 201 e registros em `users` e `email_verifications` | Positivo |
| CT-02 | Cadastro com email existente | POST /api/signup com email já cadastrado | 409 | Negativo |
| CT-03 | Login com credenciais corretas | POST /api/login com email confirmado | 200 + tokens | Positivo |
| CT-04 | Login com senha incorreta | POST /api/login com senha errada | 401 e incrementa failed_login_attempts | Negativo |
| CT-05 | Confirmar email com token válido | GET /api/email/confirm?token= | 200 e `confirmed=true` | Positivo |
| CT-06 | Reenvio excessivo | POST /api/email/resend repetido além do limite | 429 | Borda |
| CT-07 | Reset de senha com token válido | POST /api/password/reset | 200 e password_hash atualizado | Positivo |
### Critérios de Aceite

**Comportamento e entrega:**
- [ ] CA-01: POST /api/signup retorna 201 e cria `users` com `confirmed=false` e registro em `email_verifications`.
- [ ] CA-02: Enfileiramento de email acontece ao cadastrar (verificável em logs/queue).
- [ ] CA-03: GET /api/email/confirm?token valid marca `users.confirmed=true` e invalida token.
- [ ] CA-04: POST /api/login com credenciais corretas e `confirmed=true` retorna tokens 200.
- [ ] CA-05: POST /api/email/resend aplica rate limit e incrementa `sent_count` quando dentro do limite.

**Regressão:**
- [ ] Não impactar endpoints já existentes de autenticação (compatibilidade com integração frontend atual).

**Qualidade de código (SonarQube):**
- [ ] Quality Gate aprovado sem bloqueadores
- [ ] Cobertura de testes: mínimo de 70% nas classes/handlers alteradas
- [ ] Zero issues de segurança Blocker/Critical

| Tempo médio de entrega de email (inbox) | Atual: desconhecido | < 2min para providers de teste | Medir via logs e provider responses |

---

## Grupo 5 — Estimativa

**Use Points gerados:** 5–8 (estimativa inicial)
**Estimativa de custo:** 2–3 dias dev + 1 dia infra/ops para configurar SMTP/queue
