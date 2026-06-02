# Glossário do Projeto

> **Como preencher:** registre aqui todos os termos do domínio de negócio que qualquer pessoa do time precisa conhecer para trabalhar neste projeto. Ordene alfabeticamente.
> **Caminho:** `02-systems/{sistema}/context/glossary.md`
> **Regra de ouro:** se alguém de fora do negócio não entendesse um termo nas conversas, nos requisitos ou nas telas, ele deve estar aqui.

---

## Termos do Domínio

> Escreva definições completas — o que é o termo, como funciona no contexto do negócio e quem o usa. Evite definições de uma linha.

| Termo | Tradução EN | Definição | Evitar (sinônimos incorretos) |
|---|---|---|---|
| Administrador | Administrator | Usuário autenticado da equipe da ONG CatDog responsável por cadastrar e manter os animais na plataforma, analisar solicitações de adoção e atualizar as informações operacionais do sistema. Tem permissão para gerenciar todos os animais e todas as solicitações registradas. | dono, chefe, tutor, doador |
| Adotante | Adopter | Usuário autenticado que acessa a plataforma para buscar cães e gatos disponíveis para adoção. Pode consultar a listagem pública, visualizar detalhes dos animais e enviar solicitações de adoção para os animais de interesse. | interessado, comprador, dono futuro |
| Animal | Animal | Entidade central da plataforma. Representa um cão ou gato cadastrado pela ONG para adoção, com atributos fixos como espécie, raça, sexo e porte, além de atributos variáveis como fotos e status operacional. É usado por administradores para gestão e por adotantes para consulta e solicitação de adoção. | bichinho, mascote, coisa |
| Animal adotado | Adopted animal | Status de um animal cuja adoção já foi concluída. Nesse estado, ele deixa de aparecer na busca pública, permanece disponível para consulta administrativa e não deve mais aceitar novas solicitações ativas. | finalizado sem contexto, entregue |
| Animal disponível | Available animal | Status de um animal que está visível na busca pública da plataforma e apto a receber solicitações de adoção. É o estado operacional normal de exposição para adotantes. | publicado, liberado |
| Animal pausado | Paused animal | Status de um animal temporariamente oculto da busca pública, definido por um administrador quando o animal não deve receber novas solicitações naquele momento. Pode ser reativado posteriormente sem perda do cadastro. | escondido, suspenso sem regra |
| Animal removido | Removed animal | Status de um animal removido por ação administrativa ou moderação. Nesse estado, ele fica invisível em toda a plataforma e não participa mais do fluxo operacional de adoção. | excluído definitivo, apagado |
| Porte | Size category | Classificação de tamanho do animal em três categorias: pequeno (até 10 kg), médio (de 10 a 25 kg) e grande (acima de 25 kg). É usado para caracterização do cadastro e também como critério de filtro na busca pública. | tamanho, peso |
| Rascunho | Draft | Status inicial do cadastro de um animal quando ele ainda não possui nenhuma foto cadastrada. Enquanto estiver em rascunho, o animal não aparece publicamente para adotantes. | incompleto, provisório |
| Solicitação aceita | Accepted adoption request | Status final de uma solicitação de adoção que foi aprovada por um administrador. Quando isso acontece, o animal correspondente muda para adotado e as demais solicitações pendentes para esse mesmo animal devem ser recusadas automaticamente. | aprovada sem contexto |
| Solicitação de adoção | Adoption request | Manifestação formal de interesse de um adotante por um animal específico. É registrada dentro da plataforma, contém mensagem livre e dados do adotante e segue o fluxo pendente, aceita ou recusada. Serve como base para a triagem e priorização interna da ONG. | pedido, candidatura, aplicação |
| Solicitação pendente | Pending adoption request | Status inicial de uma solicitação enviada por um adotante e que ainda aguarda análise ou contato do administrador. Enquanto estiver pendente, ela representa interesse ativo no animal correspondente. | em aberto |
| Solicitação recusada | Rejected adoption request | Status final de uma solicitação que foi negada por um administrador ou recusada automaticamente porque outra solicitação do mesmo animal foi aceita antes. Indica que aquela tentativa de adoção não seguirá adiante. | negada sem regra |

---

## Status e Ciclos de Vida

> Liste os status de cada entidade principal do sistema e o fluxo entre eles. Essencial para que o time entenda as transições permitidas e as regras de negócio associadas.

### Animal

O cadastro de animal começa como rascunho quando ainda não possui foto. Ao receber pelo menos uma foto, pode se tornar disponível para adoção. Um animal disponível pode ser pausado, marcado como adotado ou removido. Um animal pausado pode voltar a ficar disponível, ser adotado ou removido. Os estados adotado e removido são finais.

| Status | Descrição | Transições permitidas |
|---|---|---|
| Rascunho | Animal cadastrado sem nenhuma foto e não visível publicamente. | Disponível |
| Disponível | Animal visível para adotantes na busca pública e apto a receber solicitações. | Pausado, Adotado, Removido |
| Pausado | Animal temporariamente oculto da busca pública, reativável pelo administrador. | Disponível, Adotado, Removido |
| Adotado | Animal com adoção concluída, visível apenas para administradores. | Estado final |
| Removido | Animal removido por ação administrativa e invisível em toda a plataforma. | Estado final |

### Solicitação de adoção

A solicitação de adoção é criada em estado pendente e aguarda análise administrativa. Ela pode ser aceita ou recusada. Quando uma solicitação é aceita, as demais solicitações pendentes do mesmo animal devem ser recusadas automaticamente.

| Status | Descrição | Transições permitidas |
|---|---|---|
| Pendente | Solicitação enviada pelo adotante aguardando resposta do administrador. | Aceita, Recusada |
| Aceita | Solicitação aprovada pelo administrador; faz o animal mudar para adotado. | Estado final |
| Recusada | Solicitação negada pelo administrador ou recusada automaticamente após outra ser aceita. | Estado final |

---

## Relações Entre Termos

- Um adotante pode criar várias solicitações de adoção ao longo do uso da plataforma.
- Um adotante pode ter no máximo uma solicitação para o mesmo animal.
- Uma solicitação de adoção pertence a exatamente um animal.
- Um animal pode receber várias solicitações de adoção ao longo do tempo.
- Quando uma solicitação de um animal é aceita, as demais solicitações pendentes desse mesmo animal são recusadas automaticamente.
- Um administrador pode gerenciar todos os animais e todas as solicitações da plataforma.
- Um animal sempre pertence a uma das espécies permitidas no MVP: cão ou gato.
- O status do animal determina sua visibilidade pública e sua capacidade de receber novas solicitações.

---

## Siglas e Abreviações

| Sigla | Significado | Contexto de uso |
|---|---|---|
| Não há | Não há siglas de negócio no momento | A ONG e o produto ainda não utilizam siglas padronizadas de negócio |

---

## Histórico de Alterações

| Data | Termo | Alteração | Motivo |
|---|---|---|---|
| 2026-05-28 | Termos iniciais do domínio CatDog | Adicionado | Criação do glossário inicial do projeto |
| 2026-05-28 | Status de animal e solicitação de adoção | Adicionado | Formalização dos ciclos de vida do MVP |