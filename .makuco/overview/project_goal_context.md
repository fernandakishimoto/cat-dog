# Objetivo do Projeto

---

## Identificação do Sistema

**Nome do sistema:** CatDog

**Status:** Em desenvolvimento

**Repositório de código:** Não definido até o momento.

**Última atualização:** 2026-05-28 — Fernanda Kishimoto

### Ambientes

| Ambiente | URL |
|---|---|
| Desenvolvimento | Não definido |
| Homologação | Não definido |
| Produção | Não definido |

---

## Problema a Ser Resolvido

**Situação atual:** Hoje a divulgação dos animais e o recebimento das solicitações de adoção acontecem por canais dispersos, como grupos de Facebook e conversas no WhatsApp. Todo o processo é manual, sem um sistema central para registrar os animais disponíveis, consolidar o histórico das solicitações e organizar o trabalho da equipe da ONG.

**Causa raiz:** O problema existe porque a ONG CatDog ainda não possui uma plataforma própria para concentrar o cadastro dos animais e o controle das solicitações de adoção. Como consequência, as informações ficam espalhadas em plataformas genéricas de comunicação, sem padronização de processo nem visibilidade consolidada.

**Impacto:** Os 3 administradores da ONG têm dificuldade para acompanhar as solicitações, manter o histórico organizado e coordenar o atendimento sem perda de contexto. Os adotantes também são impactados, porque não têm uma visualização centralizada e confiável dos animais disponíveis para adoção. Isso aumenta o esforço operacional da equipe e reduz a clareza do processo para o público interessado.

---

## Objetivo do Projeto

**Onde devemos chegar com o projeto entregue:**

- Centralizar em um único sistema o cadastro e a publicação dos animais disponíveis para adoção pela ONG.
- Permitir que qualquer adulto interessado em adotar consiga consultar com facilidade os animais disponíveis.
- Registrar e organizar internamente as solicitações de adoção para reduzir dispersão de informações e melhorar o acompanhamento pela equipe.
- Melhorar a organização operacional dos administradores por meio de um histórico centralizado das solicitações recebidas.

---

## Visão Geral do Sistema

### Propósito

O CatDog é uma plataforma de adoção de animais de uma única ONG. Seu propósito é substituir o controle manual hoje feito em canais como Facebook e WhatsApp por um sistema próprio, no qual os administradores possam cadastrar animais e gerenciar solicitações de adoção, enquanto os adotantes consultam os animais disponíveis. O sistema busca dar mais organização para a equipe e mais clareza para o público interessado em adotar.

### Público-Alvo e Usuários

**Perfil 1 — Administrador da ONG**  
Descrição: membro da equipe CatDog responsável por manter o cadastro dos animais atualizado, acompanhar as solicitações de adoção e organizar o trabalho interno da ONG.  
O que faz e quando faz: acessa o sistema no dia a dia da operação para cadastrar animais e espécies, atualizar disponibilidade e consultar o histórico das solicitações recebidas.

**Perfil 2 — Adotante**  
Descrição: pessoa adulta interessada em adotar um animal da ONG.  
O que faz e quando faz: consulta os animais disponíveis na plataforma e realiza uma solicitação de adoção quando encontra um animal de interesse.

**Perfil 3 — Organização CatDog**  
Descrição: a própria ONG como unidade operacional e patrocinadora do sistema, interessada em melhorar seu processo de adoção e a organização interna.  
O que faz e quando faz: define as regras do processo, acompanha o uso da plataforma e utiliza o sistema como ferramenta central da operação de adoções.

### Contexto de Mercado e Posicionamento

**Contexto de mercado:** O sistema atua no contexto de adoção de animais por organizações de proteção animal. Hoje, muitas ONGs pequenas operam com processos manuais e canais genéricos de comunicação e divulgação, o que dificulta padronização, rastreabilidade e organização do atendimento.

**Posicionamento:** O CatDog se posiciona como uma plataforma própria e centralizada para a operação da ONG, substituindo a dispersão de informações em redes sociais e aplicativos de mensagens. Seu diferencial, neste momento, não é atender múltiplas organizações, mas dar controle operacional e visibilidade unificada para a ONG CatDog.

**Público-alvo de mercado:** Neste momento, o sistema se destina exclusivamente à ONG CatDog e ao público adulto interessado em adotar animais disponibilizados por essa organização.

### Contexto de Uso pelo Cliente

A ONG CatDog usará o sistema como ponto central do processo de adoção. Os administradores cadastrarão espécies e animais, manterão a listagem de disponíveis atualizada e registrarão internamente as solicitações recebidas. O sistema não terá integração com plataformas externas neste momento, e o contato detalhado com o adotante continuará ocorrendo fora da plataforma, por canais externos definidos pela equipe.

---

## Contexto de Negócio

**Sobre o negócio:** A CatDog é uma ONG que promove adoção de animais e precisa organizar melhor sua operação. O objetivo de negócio do sistema é reduzir a dependência de controles manuais e dar mais eficiência à gestão das adoções.

**Domínio e segmento:** O sistema está inserido no domínio de adoção de animais e gestão operacional de uma ONG de proteção animal.

**Processo atual (como as pessoas fazem hoje):** Hoje os animais são divulgados em plataformas online, como grupos de Facebook, e o contato com interessados acontece por WhatsApp. O processo é manual do início ao fim, sem centralização do cadastro dos animais nem controle interno estruturado das solicitações.

**Restrições e regras de negócio relevantes:** O sistema atenderá apenas uma organização. Não haverá pagamentos. Não haverá gestão de etapas da solicitação via mensagens, notificações ou e-mail dentro da plataforma. O contato com o adotante continuará sendo feito por fora do sistema. O sistema servirá como controle interno administrativo e vitrine dos animais disponíveis.

---

## Escopo Macro do Projeto

| # | Módulo / Epic | Prioridade |
|---|---|---|
| 1 | Cadastro de espécies e animais | Alta |
| 2 | Listagem pública de animais disponíveis | Alta |
| 3 | Solicitações de adoção | Alta |
| 4 | Painel administrativo de gestão | Média |

---

## Escopo Negativo do Projeto

| O que não será feito | Motivo |
|---|---|
| Pagamentos na plataforma | Não faz parte do processo atual da ONG e não é necessário para o objetivo inicial |
| Envio de mensagens, notificações ou e-mails pelo sistema | O contato com adotantes continuará sendo feito externamente |
| Suporte a múltiplas organizações | O projeto foi definido para atender apenas a ONG CatDog neste momento |

---

## Pessoas e Interesses (Stakeholders)

| Nome | Empresa / Área | Papel no Projeto |
|---|---|---|
| Fernanda Kishimoto | CatDog / Projeto | Responsável pelo contexto do projeto |
| Equipe administrativa da ONG | CatDog / Operação | Usuários administradores |
| Adotantes | Público externo | Usuários finais |
| ONG CatDog | Organização | Patrocinadora e stakeholder de negócio |

---