# Gestão do Projeto e Ciclo de Desenvolvimento

> **Como preencher:** registre aqui como o projeto é gerenciado — onde o trabalho vive, como está organizado e como o time opera no dia a dia. Qualquer pessoa que entre no projeto deve conseguir entender o fluxo de trabalho lendo este documento.
> **Caminho:** `02-systems/{sistema}/management/project-management.md`

---

## Plataforma de Gestão

**Plataforma:** GitHub Projects
**URL / Acesso:** Não definido
**Como solicitar acesso:** Solicitar acesso aos responsáveis pelo repositório e pelo board do projeto no GitHub.

---

## Modelo de Organização do Trabalho

> Defina o significado de cada nível da hierarquia de trabalho neste projeto. Sem essa definição, cada pessoa do time interpreta os conceitos de forma diferente.

| Nível | Nome utilizado | O que representa | Exemplo |
|---|---|---|---|
| 1 — mais alto | Épico | Agrupa um conjunto amplo de entregas relacionadas a um mesmo objetivo de negócio. | Adoção de animais |
| 2 | Feature | Agrupa um conjunto de tasks necessárias para entregar uma funcionalidade completa. | Cadastro e publicação de animais |
| 3 | Task | Representa uma entrega pequena e implementável dentro do ciclo de desenvolvimento. | Criar endpoint de cadastro de animal |
| 4 — mais baixo | Sub-task | Representa uma atividade técnica específica dentro de uma task, quando houver necessidade de quebrar o trabalho. | Validar upload de foto do animal |

---

## Tamanho e Critérios de um PBI

> O tamanho máximo de um PBI define o ritmo de entrega e a capacidade de revisão do time. Estabeleça limites claros para evitar PBIs que duram semanas.

**Tamanho máximo:** Uma task deve ser concluível dentro de uma sprint de 2 semanas, preferencialmente em poucos dias, para evitar acúmulo de risco e dificuldade de revisão.

**Um bom PBI deve:**
- Ter critério de aceite claro e verificável
- Poder ser desenvolvido e testado de forma independente
- Ser pequeno o suficiente para caber no ciclo
- Ter valor de negócio ou técnico identificável

**Um PBI deve ser quebrado quando:**
- Não puder ser concluído com segurança dentro da sprint
- Tiver mais de uma responsabilidade principal
- Depender de outro item para ser validado corretamente
- Ficar grande demais para revisão de código e testes em tempo adequado

---

## Modelo de Desenvolvimento

**Metodologia:** Scrum

**Duração do ciclo:** Sprints de 2 semanas

**Início do ciclo:** Não definido

---

## Cerimônias e Rituais

> Liste apenas as cerimônias que este time realmente pratica. Remova as que não se aplicam.

| Cerimônia | Frequência | Duração | Objetivo |
|---|---|---|---|
| Planning | A cada sprint | Não definido | Planejar o trabalho da sprint |
| Daily | Diária | Não definido | Sincronizar o time e identificar bloqueios |
| Review | A cada sprint | Não definido | Demonstrar o que foi entregue |
| Retrospectiva | A cada sprint | Não definido | Identificar melhorias no processo |
| Refinamento | Durante a sprint | Não definido | Preparar e detalhar os próximos itens |

---

## Fluxo de Status

> Defina os status que um item percorre desde a criação até a entrega. Mapeie exatamente como está configurado na plataforma de gestão.

| Status | Descrição | Quem move para cá |
|---|---|---|
| analyzing | Item em análise ou refinamento antes de entrar no ciclo de desenvolvimento. | Time / responsáveis pelo refinamento |
| new | Item criado e ainda não iniciado. | Quem cria ou prioriza o item |
| developing | Item em desenvolvimento. | Desenvolvedor responsável |
| for code review | Desenvolvimento concluído, aguardando revisão de código. | Desenvolvedor responsável |
| to test | Item pronto para testes funcionais ou validação. | Desenvolvedor ou revisor |
| testing | Item em execução de testes e validação. | QA, PO ou responsável pela validação |
| to deploy | Item validado e aguardando publicação no ambiente definido. | Responsável técnico pelo fluxo de entrega |
| closed | Item concluído, publicado quando aplicável e considerado encerrado. | Responsável final pelo aceite ou entrega |

---

## Definição de Pronto (Definition of Done)

> Um item só pode ser marcado como Done quando todos os critérios abaixo forem atendidos. Esta lista é do time — ajuste conforme a realidade do projeto.

- Código revisado por outro desenvolvedor
- Testes automatizados passando
- Funcionalidade validada pelo PO quando aplicável
- Interface e fluxo aderentes ao esperado
- Documentação atualizada quando houver impacto relevante
- Deploy feito no ambiente definido, quando aplicável

---

## Acompanhamento e Monitoramento

**Responsável pelo acompanhamento:** Não definido

**Métricas acompanhadas:**

| Métrica | O que mede | Onde é acompanhada | Frequência |
|---|---|---|---|
| Não definido | Não definido | Não definido | Não definido |

**Reporte para stakeholders:** Não definido
