Supabase Email Diagnostics
=========================

Resumo dos testes e próximos passos para diagnosticar falha no envio de email (2026-06-08).

1) Test script

  - Arquivo: `services/backend/scripts/test_supabase_signup.js`
  - Uso: execute no workspace root:

```bash
node services/backend/scripts/test_supabase_signup.js <email> <password>
```

  - O script usa `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` de `services/backend/.env`.

2) Resultados observados

  - Test 1 (email com caracteres especiais) retornou: `AuthApiError: Email address "..." is invalid` — Supabase rejeitou o formato.
  - Test 2 (email simples) retornou: `AuthApiError: email rate limit exceeded` (HTTP 429, `over_email_send_rate_limit`).

3) Interpretação

  - A aplicação está conectando ao Supabase; erros vêm da API de autenticação.
  - `email rate limit exceeded` indica que o projeto/conta do Supabase atingiu limites de envio do provedor ou está em modo sandbox/sandboxed email (quota limitada).
  - `email address invalid` pode indicar validação mais estrita do Supabase ou uso de um local-part/domain que o provedor rejeita.

4) Próximos passos recomendados

  - Verificar no Supabase Dashboard (Auth → Templates / Email) se o envio de email está habilitado e se há restrições (modo sandbox, quota excedida).
  - Conferir configurações SMTP no painel do projeto (Settings → Email) — se não estiver configurado, configurar um provedor SMTP (SendGrid, Mailgun, SES) ou ativar Mailtrap/MailHog para dev.
  - Revisar a lista de supressão e logs do provedor (bounces, blocked) no dashboard do provedor de email.
  - Se desejar testes locais sem tocar o provedor, apontar Supabase para um SMTP de teste (Mailtrap) ou usar um servidor local de captura (MailHog) e ajustar `SUPABASE_*` conforme necessário.
  - Habilitar logs detalhados: executar o endpoint `/auth/register` localmente (ou script) com a instrumentação de logs adicionada em `AuthService` (já implementada neste repositório) para capturar `error` retornado pela API.

5) Observações técnicas

  - O cliente `@supabase/supabase-js` neste repositório precisa do transporte `ws` em Node.js < 22; o script de teste já lida com isso exigindo o pacote `ws` instalado.
  - A criação de usuários via Supabase pode ser afetada por políticas de validação do provedor (ex.: bloquear domínios públicos de teste) ou por regras de segurança do projeto.

6) Se quiser, eu posso:

  - Automatizar a verificação de quotas e logs chamando a API admin do Supabase (se houver permissões), ou
  - Gerar um checklist passo-a-passo para configuração SMTP no Supabase e testar novamente.
