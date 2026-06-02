# Definição de Arquitetura

---

## Padrão Arquitetural Adotado

**Padrão:** Monólito distribuído em monorepo, com backend modular em camadas por domínio e frontend web separado

**Justificativa:** O CatDog será desenvolvido por uma equipe pequena e tem como prioridade simplicidade de implementação, baixo custo operacional, facilidade de manutenção e rapidez de entrega. Por isso, a solução evita microserviços e mecanismos de integração mais complexos, como filas e mensageria. A escolha por um monorepo com dois serviços independentes — um backend e um frontend — permite separar claramente responsabilidades sem aumentar excessivamente a complexidade técnica. No backend, a organização modular por domínio com controllers, services e repositories favorece manutenção, entendimento do código e crescimento incremental do produto. Essa abordagem é suficiente para o contexto atual da plataforma, que atende uma única ONG e possui um domínio de negócio relativamente concentrado.

---

## Como o Sistema está Organizado

O sistema será mantido em um monorepo contendo dois serviços principais: frontend e backend. O frontend, desenvolvido em Next.js, será responsável pela experiência web pública dos adotantes e pelas interfaces administrativas, consumindo exclusivamente a API própria do backend. O backend, desenvolvido em Node.js com NestJS, concentrará as regras de negócio, autenticação, gestão dos animais e processamento das solicitações de adoção. Internamente, o backend será organizado por módulos de domínio, seguindo a separação padrão entre controllers, services e repositories. O Supabase será utilizado como base de dados relacional e também como serviço de storage para arquivos, especialmente fotos dos animais.

---

## Decisões Arquiteturais Importantes

| Decisão | O que foi decidido | Justificativa |
|---|---|---|
| Estratégia de organização do projeto | O sistema será mantido em um monorepo com dois serviços independentes: frontend e backend. | Permite centralizar o desenvolvimento em um único repositório, simplificar colaboração da equipe pequena e manter separação clara entre as camadas da aplicação. |
| Estrutura do backend | O backend será implementado em NestJS com organização modular por domínio, usando controllers, services e repositories. | Essa estrutura facilita manutenção, leitura do código e evolução incremental sem exigir padrões mais sofisticados para o estágio atual do produto. |
| Comunicação entre aplicações | O frontend em Next.js consumirá diretamente o backend por meio de API própria. | Mantém o fluxo simples, reduz acoplamentos externos e concentra as regras de negócio em um único ponto de entrada. |
| Persistência e arquivos | O Supabase será usado como banco de dados e também como storage de arquivos. | Reduz esforço operacional, centraliza infraestrutura essencial do MVP e atende bem à necessidade de armazenar dados estruturados e fotos dos animais. |
| Estratégia de distribuição | Frontend e backend terão deploy independente. | Permite evoluir e publicar cada serviço de forma isolada, com maior flexibilidade operacional e menor impacto entre mudanças. |
| Limites de complexidade inicial | O sistema não adotará microserviços, filas ou mensageria nesta fase. | O domínio atual não exige esse nível de complexidade e a equipe prioriza velocidade, simplicidade e baixo custo de operação. |

---

## Diagramas

**C1 — Contexto:** `architecture/diagrams/c4/c1-context.png` — ainda não criado
**C2 — Containers:** `architecture/diagrams/c4/c2-containers.png` — ainda não criado
**C3 — Componentes:** `architecture/diagrams/c4/c3-components.png` — ainda não criado

---

> **Lembrete:** este documento descreve a intenção arquitetural. Quando houver divergência entre o que está aqui e o que está no código, o código deve ser corrigido — ou este documento deve ser atualizado com um ADR justificando a mudança.