# Restrições e Decisões Técnicas

> **Como preencher:** registre aqui o que não deve ser usado neste projeto e por quê. Restrições sem justificativa são ignoradas — registre o motivo com clareza.
> **Caminho:** `02-systems/{sistema}/architecture/tech-restrictions.md`
> **Importante:** restrições que exigem mais contexto ou que divergem dos padrões organizacionais devem virar um ADR em `architecture/adr/`.

---

## Tecnologias Proibidas

> Liste tecnologias, bibliotecas, frameworks ou abordagens que não devem ser usados neste projeto, independentemente do contexto.

| O que não usar | Motivo | Alternativa recomendada |
|---|---|---|
| `any` em TypeScript | Elimina os benefícios da tipagem estrita e aumenta a chance de bugs escaparem para produção. | Usar tipagem explícita, interfaces, types, generics e inferência segura. |
| moment.js | Biblioteca descontinuada e pesada para o contexto do projeto. | Usar APIs nativas de data do JavaScript ou bibliotecas modernas e menores, se necessário. |
| Microserviços no MVP | O produto é pequeno e a equipe também; esse modelo aumentaria complexidade operacional sem ganho proporcional. | Manter arquitetura em monorepo com frontend e backend separados. |
| Banco de dados diferente do Supabase no MVP | A solução já foi definida em torno do Supabase como banco principal do produto. | Usar Supabase PostgreSQL como base relacional do MVP. |
| `localStorage` para dados sensíveis | Tokens e dados de usuário ficam mais expostos a ataques como XSS. | Preferir mecanismos mais seguros de sessão e armazenamento, compatíveis com a estratégia de autenticação adotada. |
| Bibliotecas de UI com dependência de jQuery | São incompatíveis com o ecossistema React/Next.js e aumentam o bundle sem necessidade. | Usar bibliotecas compatíveis com React ou componentes próprios. |

---

## Restrições de Ambiente

> Limitações impostas pelo ambiente do cliente, infraestrutura existente ou políticas da organização.

| Restrição | Descrição | Impacto no projeto |
|---|---|---|
| Aderência a padrões e boas práticas do ecossistema adotado | O projeto deve seguir os padrões recomendados para Next.js, NestJS, TypeScript e Supabase, evitando soluções improvisadas ou fora do fluxo comum dessas tecnologias. | Reduz variabilidade técnica, facilita manutenção por equipe pequena e orienta decisões de implementação sem depender de soluções excessivamente customizadas. |

---

## Restrições de Segurança e Compliance

> Requisitos obrigatórios de segurança, privacidade ou regulação que condicionam as decisões técnicas.

| Requisito | Descrição | Como é atendido |
|---|---|---|
| LGPD | Dados pessoais como e-mail, nome e foto de perfil exigem tratamento adequado, consentimento quando aplicável e política de privacidade. | O sistema deve limitar coleta ao necessário, manter política de privacidade e tratar dados pessoais conforme a finalidade do produto. |
| Senhas nunca em texto puro | Senhas não podem ser armazenadas, exibidas ou registradas em logs de forma legível. | A autenticação deve usar mecanismos seguros de gestão de credenciais, sem persistência de senhas em texto puro. |
| HTTPS obrigatório | Todo tráfego entre cliente e servidor deve ser criptografado em trânsito. | O sistema deve operar somente com HTTPS em ambientes publicados. |
| Rate limiting na API | Endpoints públicos e de autenticação podem sofrer abuso e tentativa de exploração. | A API deve aplicar limitação de requisições nas rotas mais sensíveis e expostas. |
| Validação de upload | Arquivos maliciosos podem ser enviados disfarçados como imagens. | O backend deve validar tipo, extensão e regras de upload antes de persistir arquivos no storage. |
| CORS restrito | A API não deve aceitar requisições de origens desconhecidas. | A configuração de CORS deve aceitar apenas origens explicitamente autorizadas. |

---

## Decisões Tomadas e Não Reverter

> Escolhas técnicas já feitas e consolidadas que não devem ser questionadas sem um ADR. Diferente de proibições — são decisões que já custaram tempo e que reverter teria custo alto.

| Decisão | Contexto | Por que não reverter |
|---|---|---|
| Uso de monorepo com frontend e backend separados | Definido para organizar o CatDog com dois serviços no mesmo repositório. | Reverter isso agora aumentaria esforço de organização, padronização e manutenção para uma equipe pequena. |
| Backend em Node.js com NestJS | Definido como base da API e da lógica de negócio do produto. | Mudar de stack exigiria reestruturação ampla do projeto e perda de velocidade de entrega. |
| Frontend em Next.js | Definido como framework web da interface pública e administrativa. | Trocar o frontend geraria retrabalho alto e reduziria a consistência da arquitetura escolhida. |
| Supabase como banco, auth e storage no MVP | Definido como plataforma principal de persistência, autenticação e arquivos. | Reverter essa decisão aumentaria custo técnico e operacional, além de impactar integrações já previstas no projeto. |
| Deploy independente entre frontend e backend | Definido como estratégia operacional da solução. | Reverter exigiria repensar pipeline, versionamento e fluxo de entrega dos dois serviços. |
