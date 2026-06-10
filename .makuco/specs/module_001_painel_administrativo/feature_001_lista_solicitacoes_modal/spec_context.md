# FEATURE-001 — Lista de solicitações de adoção e modal de detalhes

---

## Grupo 1 — Identificação

**Feature:** FEATURE-001 — Lista de solicitações de adoção e modal de detalhes
**Módulo:** MODULE-001 — Painel administrativo
**Status:** Rascunho
**Criado por:** Fernanda Kishimoto — 2026-06-08
**Aprovado por:** _A preencher_

---

## Objetivo da Feature

Esta feature cria o fluxo de chegada do administrador ao painel de solicitações de adoção após o login e permite que ele visualize cada pedido em um modal com o mesmo layout e informações do print de referência. O objetivo é reduzir a navegação desnecessária, acelerar a triagem dos pedidos e manter os detalhes da solicitação disponíveis sem sair da lista. O valor entregue é maior eficiência operacional para a ONG e menos risco de perda de contexto durante a análise de solicitações.

---

## Grupo 2 — Contexto

### Quem Acessa

| Perfil / Permissão | Nível de acesso | Observação |
|---|---|---|
| Administrador | Total | Acesso à lista de solicitações e ao modal de detalhes; redirecionado para esta tela após login |

---

### Premissas

- O usuário já está autenticado e possui role de administrador.
- O frontend já possui um mecanismo de redirecionamento por role após o login.
- A lista de solicitações de adoção já existe como recurso de backend ou será implementada em outro feature dependente.
- O modal exibirá informações apenas de leitura e ações de status, sem alterar o fluxo de cadastro do adotante.
- A tela de lista e o modal seguem o visual atual do CatDog com foco em clareza, hierarquia e uso de botões destacados para ações críticas.

---

### Dependências

| Dependência | Tipo | Status | Impacto se não resolvida |
|---|---|---|---|
| Redirecionamento por role após login | Decisão / Frontend | Pendente / Parcial | Sem isso, o administrador não chega automaticamente à lista de solicitações |
| API de listagem de solicitações de adoção | Integração backend | Pendente | A tela de listagem não pode carregar dados reais |
| API de detalhes de solicitação | Integração backend | Pendente | O modal não pode exibir informações completas do pedido |
| Autenticação de sessão | Infraestrutura | Resolvida | Necessária para proteger o painel administrativo |

---

### Referências e Insumos

**Protótipo / Wireframe:**
- Link externo: https://www.figma.com/design/GHOHHm3DfTLVKaD79xVTJh/CatDog--Copy-?node-id=143-1517&t=BvgMxNYOPEYzmtP6-4

**Prints de referência (estado atual):**
- Tela de listagem de solicitações de adoção
- Modal de solicitação com dados do adotante, animal, status do processo e botões de ação

**Artefatos consultados:**
- `.makuco/overview/glossary_context.md` — definição de Solicitação de adoção
- `.makuco/product/scope_features_context.md` — módulo Painel administrativo e fluxo de solicitações

**Tabelas de banco de dados:** Solicitação de adoção, Animal, Usuário
**MCPs utilizados:** autenticação e roteamento por role do frontend
**SKILLs utilizados:** makuco-business-analyst

---

## Grupo 3 — Comportamento

### Histórias de Usuário

#### HU-01 — Redirecionamento ao painel de solicitações após login

Como administrador, ao fazer login, quero ser redirecionado automaticamente para a tela de listagem de solicitações de adoção, para começar a análise dos pedidos sem precisar buscar manualmente o painel.

**Pode ser testada independentemente:** Sim. Com um administrador confirmado, o login deve apontar diretamente para a rota do painel de solicitações.

**Cenários de aceite:**

1. **Dado** que um administrador autenticado conclui o login, **quando** a autenticação é aceita, **então** ele é redirecionado para a tela de listagem de solicitações de adoção.
2. **Dado** que outro perfil autenticado (não administrador) conclui o login, **quando** a autenticação é aceita, **então** ele é redirecionado para seu dashboard padrão e não para a lista de solicitações.

---

#### HU-02 — Visualização de solicitação em modal

Como administrador, quero clicar em “Ver solicitação” em uma linha da lista e ver os detalhes completos do pedido em um modal, para avaliar rapidamente sem mudar de página.

**Pode ser testada independentemente:** Sim. A lista de solicitações deve conter o botão de ação e o modal deve abrir com os dados corretos do pedido.

**Cenários de aceite:**

1. **Dado** que um administrador está na lista de solicitações, **quando** clica em “Ver solicitação” em um pedido, **então** o modal abre sobre a tela sem redirecionar.
2. **Dado** que o modal está aberto, **quando** ele visualiza o pedido, **então** os campos obrigatórios são exibidos: data da solicitação, status, adotante, animal e observações.
3. **Dado** que o pedido está em um estágio de processo intermediário, **quando** o modal abre, **então** ele mostra o status do processo com etapas como formulário, envio de documentação, entrevista, visita domiciliar e aprovação final.
4. **Dado** que o pedido está no estágio final, **quando** o modal abre, **então** as ações críticas de “Rejeitar Adoção” e “Aprovar Adoção” aparecem de forma clara.

---

### Regras de Negócio

- **RN-01:** Apenas usuários com perfil de administrador têm acesso à tela de listagem de solicitações de adoção e ao modal de detalhes.
- **RN-02:** O primeiro destino de um administrador após login deve ser a lista de solicitações de adoção, não uma tela genérica.
- **RN-03:** O modal deve ser exibido como sobreposição modal e não deve gerar navegação de página ou alteração direta do histórico de rota ao abrir.
- **RN-04:** O modal deve mostrar o status atual do processo de solicitação e as etapas previstas para o fluxo interno.
- **RN-05:** A mensagem de status e o botão de ação principal devem ser visíveis e legíveis, com botões de ação críticos claramente identificados em cores separadas.
- **RN-06:** O usuário não deve ser capaz de acessar a lista de solicitações sem estar autenticado como administrador.
- **RN-07:** A ação “Ver solicitação” deve permanecer disponível mesmo quando a solicitação estiver em qualquer um dos estágios registráveis.

---

### Requisitos Funcionais

#### O que o sistema exibe ao ser acessado

Ao chegar na tela de listagem de solicitações de adoção, o administrador vê:
- Cabeçalho com título da tela e contexto do fluxo de análise de pedidos
- Barra de busca e filtros para localizar solicitações por nome de pet, cidade, espécie, sexo, porte e idade
- Tabela/listagem de solicitações com colunas básicas:
  - Data da solicitação
  - Pet (nome e cidade)
  - Idade do pet
  - Sexo
  - Porte
  - Ações
- Cada linha inclui um botão “Ver solicitação” ou “Visualizar” que abre o modal
- Paginação ou navegação entre páginas de resultados

#### Ações disponíveis

**Ação 1 — Redirecionar para a lista de solicitações após login**

Após login bem-sucedido de um administrador, o sistema leva o usuário diretamente à tela de listagem de solicitações de adoção.

Regras condicionais:
- Se o usuário for administrador → redireciona para a lista de solicitações
- Se o usuário for outro perfil autenticado → redireciona para seu dashboard padrão

**Ação 2 — Abrir modal de solicitação**

Ao clicar em “Ver solicitação”, o modal abre com os detalhes do pedido selecionado.

Regras condicionais:
- Se a solicitação está carregada com sucesso → exibe o modal completo
- Se há falha ao carregar o pedido → exibe uma mensagem de erro no modal ou fora do modal

**Ação 3 — Navegar por etapas do processo no modal**

O modal mostra o status atual do processo de adoção e, quando aplicável, permite avançar para a próxima etapa ou aprovar/rejeitar o pedido.

Regras condicionais:
- Se o pedido estiver em etapa intermediária → exibe botão “Avançar” e botão “Retroceder” conforme necessário
- Se o pedido estiver no último estágio → exibe “Rejeitar Adoção” e “Aprovar Adoção”
- Se o administrador atualizar observações → as observações são salvas ao usar o botão apropriado

#### Validações e Restrições

- A tela de listagem só é exibida para o perfil Administrador.
- O botão “Ver solicitação” só aparece quando há um pedido válido e acessível.
- O campo de pesquisa deve aceitar textos livres para filtrar por pet ou região.
- O modal só abre se o pedido selecionado existir e retornar dados completos.
- Se o pedido já estiver finalizado, o modal deve exibir o status final e desabilitar ações de avanço.

#### Mensagens ao Usuário

| Condição | Mensagem |
|---|---|
| Não há solicitações | "Nenhuma solicitação de adoção encontrada." |
| Erro ao carregar solicitações | "Não foi possível carregar as solicitações no momento. Tente novamente." |
| Erro ao carregar detalhes | "Não foi possível abrir a solicitação. Atualize a página e tente novamente." |
| Pedido finalizado | "Esta solicitação já está concluída e não pode ser alterada." |

---

#### Integrações

| Sistema externo | O que é enviado | O que é recebido | Em caso de falha |
|---|---|---|---|
| Backend de adoção | Requisição de lista de solicitações | Lista paginada de solicitações | Exibe mensagem de erro e mantém tela de listagem vazia |
| Backend de adoção | Requisição de detalhes da solicitação | Dados completos do pedido e status do processo | Exibe mensagem de erro no modal |
| Backend de adoção | Requisição de atualização de status | Confirmação de alteração de etapa/status | Exibe mensagem de erro e mantém status anterior |

---

### Requisitos Não Funcionais

| ID | Tipo | Requisito | Critério mensurável |
|---|---|---|---|
| RNF-01 | Desempenho | A lista deve carregar em até 2 segundos com 20 solicitações exibidas na primeira página | A primeira renderização completa em < 2s em conexão padrão de 4G |
| RNF-02 | Usabilidade | O modal deve ser legível e acionável em tela de desktop com ao menos 1024x768 | Todos os campos principais visíveis sem rolagem excessiva em 1024x768 |
| RNF-03 | Segurança | Apenas administradores autenticados podem acessar a lista e o modal | Acesso negado para qualquer usuário sem role admin |

---

### O que Não Deve Ser Feito

- Esta feature não implementa o fluxo de envio de uma nova solicitação pelo adotante.
- Não deve alterar o processo de cadastro de usuário ou a lógica de login além do redirecionamento por role.
- Não deve expor dados de contato de adotantes a perfis que não sejam administradores.
- Não deve substituir a navegação por página do backend; o modal deve ser um overlay de leitura/ação.

---

## Grupo 4 — Validação

### Casos de Teste

| ID | Cenário | Entrada | Resultado esperado | Tipo |
|---|---|---|---|---|
| CT-01 | Login de administrador | Autenticação válida com role admin | Redireciona para a lista de solicitações | Positivo |
| CT-02 | Login de outro perfil | Autenticação válida com role não admin | Redireciona para dashboard padrão | Positivo |
| CT-03 | Abrir modal de solicitação | Clicar em “Ver solicitação” | Modal abre com todos os dados do pedido | Positivo |
| CT-04 | Pedido sem detalhes | Abrir pedido inexistente | Exibe mensagem de erro de carregamento | Negativo |
| CT-05 | Pedido finalizado | Abrir pedido com status final | Modal exibe status final e ações de avanço desabilitadas | Borda |

---

### Critérios de Aceite

**Comportamento e entrega:**
- [ ] CA-01: O administrador autenticado é redirecionado imediatamente para a tela de listagem de solicitações de adoção após o login.
- [ ] CA-02: A tela de listagem mostra cada solicitação com a ação “Ver solicitação”.
- [ ] CA-03: Ao clicar em “Ver solicitação”, o modal abre sem navegação de página.
- [ ] CA-04: O modal exibe data da solicitação, status, adotante, animal, cidade e observações.
- [ ] CA-05: O modal mostra o fluxo de etapas do processo de adoção e exibe as ações apropriadas para o estágio atual.

**Regressão:**
- [ ] O redirecionamento após login não altera o fluxo de outros perfis existentes.

**Qualidade de código (SonarQube):**
- [ ] Quality Gate aprovado sem bloqueadores
- [ ] Cobertura de testes: mínimo de 80% nas unidades alteradas no frontend
- [ ] Zero issues de segurança (Severity: Blocker ou Critical)

---

### Critério de Sucesso da Feature

| Métrica | Baseline atual | Meta após entrega | Como será medida |
|---|---|---|---|
| Tempo até a primeira solicitação visualizada | Sem métrica definida | Administradores chegam à lista em menos de 10 segundos após login | Observação de fluxo e testes de aceitação |
| Eficiência de análise de solicitação | Sem métrica definida | Administradores conseguem abrir detalhes a partir da lista sem mudar de página | Validação manual com roteiros de QA |

---

## Grupo 5 — Estimativa

> A estimativa será refinada após revisão do design de interface e da arquitetura de integração.

**Use Points gerados:** A ser definido após refinamento
**Estimativa de custo:** A ser definida após revisão da equipe de desenvolvimento
