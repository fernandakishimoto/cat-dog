# Stack de Tecnologia

> **Como preencher:** registre todas as tecnologias, ferramentas e sistemas utilizados neste projeto. O objetivo é que qualquer desenvolvedor novo saiba exatamente com o que vai trabalhar antes de configurar o ambiente.
> **Caminho:** `02-systems/{sistema}/architecture/tech-stack.md`

---

## Linguagem e Runtime

| Item | Tecnologia | Versão | Observação |
|---|---|---|---|
| Linguagem principal | TypeScript | Não definido | Linguagem principal do backend NestJS e do frontend Next.js. |
| Runtime / Plataforma | Node.js | Não definido | Runtime principal para execução do backend e do ambiente de desenvolvimento do frontend. |
| Gerenciador de pacotes | Yarn | Não definido | Gerenciador previsto para o monorepo. |

---

## Frameworks e Bibliotecas Principais

| Camada | Framework / Biblioteca | Versão | Finalidade |
|---|---|---|---|
| Backend | NestJS | Não definido | Implementação da API e das regras de negócio da plataforma. |
| Frontend | Next.js | Não definido | Implementação da interface web pública e administrativa. |
| ORM / Acesso a dados | SDK do Supabase | Não definido | Integração com banco de dados e serviços do Supabase a partir da aplicação. |
| Testes | Jest | Não definido | Testes automatizados do projeto. |

---

## Banco de Dados

| Tipo | Tecnologia | Versão | Uso no sistema |
|---|---|---|---|
| Relacional | Supabase PostgreSQL | Não definido | Armazenamento dos dados estruturados da plataforma, como animais, usuários e solicitações de adoção. |
| Cache | Não definido | Não se aplica | Ainda não há definição de camada de cache para o projeto. |
| Busca | Não definido | Não se aplica | Ainda não há mecanismo de busca especializado definido. |

---

## Infraestrutura e Cloud

| Item | Tecnologia | Observação |
|---|---|---|
| Cloud provider | Não definido | A infraestrutura de hospedagem ainda não foi decidida. |
| Containers | Não definido | O uso de containers ainda não foi definido. |
| Orquestração | Não definido | Não há definição de orquestração no momento. |
| CI/CD | Não definido | Pipeline de integração e entrega contínua ainda não definido. |
| Monitoramento | Não definido | Ferramentas de monitoramento ainda não definidas. |

---

## Sistemas e Componentes Externos

> Registre todos os sistemas de terceiros, APIs externas e componentes compartilhados da organização que este sistema consome ou com os quais se integra.

| Sistema / Componente | Tipo | Finalidade | Como integra |
|---|---|---|---|
| Supabase Database | API / Plataforma gerenciada | Persistir os dados relacionais do sistema. | Acesso via SDK do Supabase e consultas ao banco PostgreSQL gerenciado. |
| Supabase Auth | API / Serviço gerenciado | Autenticação dos usuários da plataforma. | Integração pela aplicação com os recursos de autenticação do Supabase. |
| Supabase Storage | API / Serviço gerenciado | Armazenamento de arquivos, principalmente fotos dos animais. | Integração pela aplicação com buckets e operações de upload e leitura. |

---

## Ferramentas de Desenvolvimento

| Ferramenta | Finalidade |
|---|---|
| VS Code | IDE principal de desenvolvimento. |
| Postman | Testes e exploração da API durante o desenvolvimento. |
| ESLint | Padronização e análise estática básica do código. |
