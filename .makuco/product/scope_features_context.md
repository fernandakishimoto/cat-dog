# Detalhamento do Escopo Macro do Projeto

> **Como preencher:** descreva a visão geral do produto, liste os módulos na ordem em que serão entregues e detalhe as features de cada um. Para cada feature, escreva pelo menos 3 linhas — o que faz, para quem serve e qual valor entrega.
> **Caminho:** `02-systems/{sistema}/product/scope-features.md`
> **Próximo passo:** com este documento aprovado, cada feature vira uma spec em `specs/{modulo}/{feature}.md` gerada pelo `makuco-specify`.

---

## Visão Geral do Produto

O CatDog é uma plataforma web de adoção de animais de estimação, focada exclusivamente em cães e gatos de uma única ONG, a CatDog. O sistema substitui o processo atual, hoje disperso entre Facebook e WhatsApp, por uma operação centralizada para cadastro de animais, exibição pública dos disponíveis e registro formal das solicitações de adoção. No MVP, os adotantes autenticados poderão buscar animais, visualizar seus detalhes e enviar solicitações, enquanto os administradores farão a gestão operacional interna. O estado desejado é uma plataforma funcional em produção que reduza o trabalho manual da equipe, preserve histórico e organize a prioridade de atendimento das solicitações.

---

## Roadmap

| Ordem | Módulo | O que entrega ao negócio |
|---|---|---|
| 1 | Cadastro de animais | Permite estruturar a base da operação com registro centralizado dos animais disponíveis e histórico administrativo |
| 2 | Listagem de animais disponíveis | Entrega uma vitrine pública organizada para que adotantes consultem os animais disponíveis com filtros e navegação |
| 3 | Solicitações de adoção | Formaliza o interesse do adotante dentro da plataforma e tira a etapa de solicitação do fluxo totalmente manual |
| 4 | Painel administrativo | Centraliza a gestão das solicitações, a priorização por ordem de chegada e o controle de disponibilidade dos animais |

---

## Módulos e Features

---

### Módulo: Cadastro de animais

> Este módulo resolve a desorganização do cadastro dos animais da ONG e cria uma base única de consulta para a operação. É usado pelos administradores, que precisam registrar, atualizar e manter histórico dos animais disponíveis ou já tratados no processo de adoção. O valor principal é dar consistência e rastreabilidade à operação, evitando controles dispersos.

#### Feature: Cadastro de animais (CRUD)

Esta feature permite aos administradores criar, consultar, editar e remover registros de animais dentro da plataforma. Ela serve para manter a base de animais sempre atualizada, com informações suficientes para alimentar tanto a listagem pública quanto o controle interno da ONG. O valor entregue está na centralização do cadastro e na redução da dependência de anotações manuais e publicações soltas em canais externos.

#### Feature: Definição de espécie do animal

Esta feature permite classificar cada animal como cão ou gato no momento do cadastro. No MVP, não haverá um CRUD livre de espécies, porque o sistema é restrito a essas duas opções pré-definidas. O valor dessa decisão é simplificar a operação inicial, reduzir complexidade administrativa e manter o sistema aderente ao escopo atual da ONG.

#### Feature: Histórico e auditoria de alterações cadastrais

Esta feature registra alterações feitas pelos administradores nos cadastros dos animais, preservando histórico para futuras consultas e controle interno. Ela serve à equipe administrativa, que pode editar qualquer cadastro a qualquer momento, mas precisa manter rastreabilidade sobre o que foi alterado. O valor entregue é maior segurança operacional e melhor governança sobre as informações mantidas pela ONG.

---

### Módulo: Listagem de animais disponíveis

> Este módulo entrega a vitrine pública do sistema e resolve a dificuldade que adotantes têm para encontrar, de forma clara e centralizada, os animais disponíveis para adoção. É usado tanto por adotantes quanto por administradores, embora com capacidades diferentes. O valor principal é facilitar a consulta, melhorar a visibilidade dos animais e reduzir o esforço manual da equipe para divulgação.

#### Feature: Listagem paginada de animais disponíveis

Esta feature apresenta os animais disponíveis em uma listagem navegável e paginada, priorizando consulta simples e organizada pelo público interessado. Ela serve principalmente aos adotantes, que precisam explorar o catálogo sem depender de grupos de Facebook ou mensagens diretas para descobrir quais animais estão aptos à adoção. O valor entregue é uma vitrine pública estruturada, com melhor experiência de consulta e menor esforço operacional para a ONG.

#### Feature: Filtros e ordenação da listagem

Esta feature permite filtrar e organizar os animais exibidos, incluindo ao menos a visualização dos animais mais recentes. Ela serve aos adotantes, que conseguem localizar mais rapidamente perfis de interesse, e também aos administradores em consultas operacionais. O valor entregue é tornar a descoberta mais eficiente e reduzir a fricção para encontrar animais relevantes no catálogo.

#### Feature: Ações rápidas de administração pela listagem

Esta feature permite que administradores editem ou removam registros diretamente a partir da própria listagem, sem precisar navegar por fluxos longos até o detalhe do animal. Ela serve exclusivamente ao perfil administrativo e acelera atividades operacionais recorrentes. O valor entregue é produtividade para a equipe e manutenção mais ágil da base de animais.

#### Feature: Relatório de consulta da listagem

Esta feature permite gerar relatórios a partir da listagem de animais, apoiando a consulta e o acompanhamento interno pela ONG. Ela serve aos administradores que precisam ter visão consolidada do catálogo e do que está disponível ou já tratado. O valor entregue é apoiar gestão e análise operacional sem depender de levantamento manual externo.

---

### Módulo: Solicitações de adoção

> Este módulo formaliza o interesse do adotante dentro da plataforma e resolve a dependência de canais externos para registrar pedidos de adoção. É usado pelos adotantes autenticados, que passam a ter um fluxo estruturado para demonstrar interesse em um animal específico. O valor principal é centralizar o registro da intenção de adoção e alimentar o processo interno da ONG com dados organizados.

#### Feature: Envio de solicitação de adoção a partir do detalhe do animal

Esta feature disponibiliza, na tela de visualização do animal, um botão para solicitar a adoção daquele registro. Ela serve ao adotante autenticado, que consegue iniciar formalmente seu interesse sem depender de contato inicial por WhatsApp ou redes sociais. O valor entregue é transformar uma intenção dispersa em uma solicitação registrada e vinculada diretamente ao animal correto.

#### Feature: Formulário de solicitação com motivo e dados de contato

Esta feature abre um modal de solicitação no qual o adotante informa o motivo da adoção e seus dados de contato. Ela serve para coletar as informações mínimas necessárias para que a ONG consiga avaliar e continuar o atendimento por fora do sistema. O valor entregue é padronizar a entrada das solicitações e reduzir perda de contexto causada por mensagens informais em canais externos.

#### Feature: Controle de múltiplas solicitações com prioridade por ordem de chegada

Esta feature permite que um mesmo animal receba múltiplas solicitações, mas registra a prioridade com base na ordem de chegada da solicitação. Ela serve à operação da ONG, que precisa tratar concorrência de interesse sem perder a referência de quem solicitou primeiro. O valor entregue é transparência interna e uma regra operacional clara para priorização do atendimento.

#### Feature: Restrição de envio para usuários autenticados

Esta feature exige que o adotante esteja autenticado para enviar uma solicitação de adoção. Ela serve para associar cada pedido a um usuário identificável e garantir rastreabilidade mínima do processo dentro da plataforma. O valor entregue é maior controle sobre as solicitações recebidas e menor ambiguidade no vínculo entre interessado e pedido realizado.

---

### Módulo: Painel administrativo

> Este módulo centraliza a operação interna da ONG sobre as solicitações de adoção e o estado de disponibilidade dos animais. É usado exclusivamente pelos administradores, que precisam visualizar prioridades, marcar mudanças de status e manter o processo organizado. O valor principal é transformar solicitações dispersas em uma fila operacional clara e administrável.

#### Feature: Dashboard administrativo de solicitações

Esta feature reúne em um painel administrativo as solicitações de adoção recebidas pela plataforma. Ela serve aos administradores que precisam ter uma visão central do volume de pedidos e do andamento operacional por animal. O valor entregue é centralização da gestão, com menos dependência de controles paralelos em mensagens ou planilhas.

#### Feature: Listagem de solicitações por ordem de chegada

Esta feature organiza as solicitações de cada animal pela ordem em que foram recebidas, respeitando a prioridade do primeiro interessado. Ela serve à equipe administrativa, que precisa aplicar uma regra objetiva de atendimento e evitar disputas ou decisões sem histórico. O valor entregue é consistência operacional e rastreabilidade da prioridade de adoção.

#### Feature: Alteração do status do animal para pendente

Esta feature permite ao administrador marcar um animal como pendente quando já existe um processo de adoção em andamento. Quando isso ocorre, o animal deixa de aparecer na listagem pública e fica visível apenas para administradores. O valor entregue é evitar novas solicitações para um animal em tratamento e reduzir retrabalho operacional.

#### Feature: Alteração do status do animal para concluído

Esta feature permite marcar o animal como concluído quando a adoção foi finalizada. Nesse estado, o animal também deixa de aparecer na listagem pública e permanece disponível apenas para consulta administrativa. O valor entregue é manter a vitrine pública coerente com a realidade e preservar o histórico interno da adoção.

---

## Fora do Escopo

| Item excluído | Motivo |
|---|---|
| Pagamentos | Não fazem parte do processo operacional deste MVP da ONG |
| Envio de notificações, mensagens ou e-mails pela plataforma | O contato com o adotante continuará sendo feito por fora do sistema |
| Chat entre adotante e administrador | Está previsto apenas como possibilidade futura, fora do MVP atual |
| Login social | Não é necessário para validar a operação inicial do produto |
| Aprovação automática de adoção | A análise continuará sendo conduzida manualmente pelos administradores |
| Área do adotante para acompanhamento da solicitação | Neste MVP, o adotante apenas envia a solicitação; o acompanhamento será externo |
| Histórico da solicitação visível ao cliente | O histórico será usado apenas internamente pela ONG |
| Suporte a outras espécies além de cães e gatos | O escopo atual da plataforma é restrito a esses dois tipos de animal |
| Suporte a múltiplas ONGs | O sistema atenderá apenas a ONG CatDog neste momento |