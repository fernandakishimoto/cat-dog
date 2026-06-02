# FEATURE-001 — Autenticação, Registro e Permissionamento por Role

---

## Grupo 1 — Identificação

**Feature:** FEATURE-001 — Autenticação, Registro e Permissionamento por Role
**Módulo:** MODULE-001 — Autenticação
**Status:** Rascunho
**Criado por:** Fernanda Kishimoto — 2026-06-02
**Aprovado por:** _A preencher_

---

## Objetivo da Feature

Esta feature resolve o problema de acesso não controlado à plataforma CatDog, garantindo que apenas usuários identificados e verificados possam operar o sistema. Adotantes precisam criar e confirmar uma conta para enviar solicitações de adoção, enquanto administradores precisam de um acesso restrito que preserve a integridade da operação da ONG. O sistema direciona automaticamente cada perfil para a área correta após autenticação, reduzindo erros operacionais e garantindo que cada usuário veja e acesse apenas o que lhe compete. O valor entregue é a base de segurança e controle de acesso que viabiliza todas as demais funcionalidades da plataforma.

---

## Grupo 2 — Contexto

### Quem Acessa

| Perfil / Permissão | Nível de acesso | Observação |
|---|---|---|
| Visitante (não autenticado) | Leitura parcial | Pode acessar telas de Login e Cadastro |
| Adotante | Escrita restrita | Acessa área de adotante, pode enviar solicitações de adoção |
| Administrador | Total | Acessa painel administrativo, gerencia animais e solicitações |

---

### Premissas

- O sistema utiliza autenticação baseada em tokens (access token + refresh token).
- O access token tem tempo de expiração curto; o refresh token é usado para renová-lo sem exigir novo login manual.
- As roles disponíveis no MVP são exclusivamente: `admin` e `adotante`.
- A criação de administradores não é feita via formulário público — novos admins são provisionados por outro admin ou diretamente no banco de dados (fora do escopo desta feature).
- O email de confirmação de conta é o único email transacional previsto para esta feature; o escopo negativo do produto proíbe outros emails e notificações.
- A confirmação de conta por email é obrigatória antes do primeiro login bem-sucedido.
- Usuários não confirmados não podem acessar nenhuma área autenticada da plataforma.
- O design visual segue a identidade CatDog: fundo cinza claro com padrão de patinhas como watermark, cores primárias roxo (#7B2D8B, aproximado) e laranja, logo com gato laranja.
- O email de confirmação deve manter referência visual ao sistema (patinhas no fundo, cores e logo CatDog).

---

### Dependências

| Dependência | Tipo | Status | Impacto se não resolvida |
|---|---|---|---|
| Serviço de envio de email transacional | Integração externa | Pendente de definição | O fluxo de confirmação de conta fica bloqueado |
| Definição da estrutura de usuários no banco de dados | Decisão técnica | Pendente | Não é possível persistir ou autenticar usuários |
| Provisionamento inicial de conta administrador | Decisão operacional | Pendente | Sem admin inicial, nenhuma operação administrativa é possível |

---

### Referências e Insumos

**Protótipo / Wireframe:**
- Tela de Login: campo email, campo senha com toggle de visibilidade, link "Esqueceu sua senha?", botão "Entrar" (roxo preenchido), link "Não tem uma conta? Cadastre-se", logo CatDog (gato laranja + texto)
- Tela de Cadastro: campos Nome, Email, Senha, Confirmar Senha, botão "Cadastrar" (roxo preenchido), botão "Voltar" (roxo outline)
- Fundo de ambas as telas: cinza claro com padrão de patinhas watermark

**Artefatos consultados:**
- `.makuco/overview/project_goal_context.md` — objetivo do projeto, perfis de usuário, regras de negócio gerais
- `.makuco/overview/glossary_context.md` — definição de Administrador e Adotante
- `.makuco/product/scope_features_context.md` — escopo do produto e módulos

---

## Grupo 3 — Comportamento

### Histórias de Usuário

---

#### HU-01 — Criação de conta pelo adotante

Um adulto interessado em adotar um animal da ONG CatDog deve conseguir criar uma conta na plataforma informando nome completo, email e senha. Após o envio do formulário, a plataforma envia um email de confirmação para o endereço informado. O acesso à plataforma como adotante só é liberado após o adotante clicar no link de confirmação recebido por email.

**Pode ser testada independentemente:** Sim. É possível realizar o cadastro, verificar o recebimento do email de confirmação, clicar no link e confirmar que o login passa a funcionar — sem depender de outras features.

**Cenários de aceite:**

1. **Dado** que um visitante acessa a tela de cadastro, **quando** preenche nome, email não cadastrado previamente, senha válida e confirmação de senha idêntica e clica em "Cadastrar", **então** a conta é criada com role `adotante`, um email de confirmação é enviado e o sistema exibe mensagem informando que o email de confirmação foi enviado.
2. **Dado** que um email de confirmação foi enviado, **quando** o adotante clica no link de confirmação dentro do prazo válido, **então** a conta é ativada e o adotante é redirecionado para a tela de login com mensagem de sucesso.
3. **Dado** que um visitante tenta criar conta com um email já cadastrado, **quando** clica em "Cadastrar", **então** o sistema exibe mensagem informando que o email já está em uso, sem revelar se a conta existente está confirmada ou não.
4. **Dado** que o link de confirmação expirou, **quando** o adotante tenta usá-lo, **então** o sistema informa que o link não é mais válido e oferece a opção de reenviar um novo email de confirmação.

---

#### HU-02 — Login com email e senha

Um usuário com conta ativa e confirmada deve conseguir autenticar-se na plataforma informando email e senha. Após autenticação bem-sucedida, o sistema redireciona o usuário para a área correspondente à sua role: adotantes vão para a área de adoção de animais; administradores vão para o painel administrativo.

**Pode ser testada independentemente:** Sim. Com contas de adotante e de admin já criadas e confirmadas, é possível validar o login, o token gerado e o redirecionamento correto para cada perfil.

**Cenários de aceite:**

1. **Dado** que um adotante com conta confirmada acessa a tela de login, **quando** informa email e senha corretos e clica em "Entrar", **então** é autenticado e redirecionado para a área de adotante, com layout específico para adotantes.
2. **Dado** que um administrador com conta confirmada acessa a tela de login, **quando** informa email e senha corretos e clica em "Entrar", **então** é autenticado e redirecionado para o painel administrativo, com layout específico para administradores.
3. **Dado** que um usuário tenta fazer login com senha incorreta, **quando** clica em "Entrar", **então** o sistema exibe mensagem de erro genérica sem revelar se o email está cadastrado ou não.
4. **Dado** que um usuário tenta fazer login com conta não confirmada por email, **quando** clica em "Entrar", **então** o sistema informa que a conta ainda não foi confirmada e oferece reenvio do email de confirmação.
5. **Dado** que um usuário está na tela de login, **quando** clica no ícone de visibilidade do campo senha, **então** o texto da senha é exibido em claro; ao clicar novamente, a senha é ocultada.

---

#### HU-03 — Renovação silenciosa de sessão via refresh token

Um usuário autenticado não deve ser forçado a fazer login novamente enquanto sua sessão ainda é válida, mesmo que o access token tenha expirado. O sistema deve renovar o access token automaticamente usando o refresh token, de forma transparente ao usuário. As permissões do usuário são reverificadas no momento da renovação, garantindo que uma mudança de role seja refletida sem que o usuário precise sair e entrar novamente.

**Pode ser testada independentemente:** Sim. É possível autenticar um usuário, aguardar a expiração do access token e verificar que a próxima requisição é completada com sucesso usando um novo access token gerado via refresh token, sem interação do usuário.

**Cenários de aceite:**

1. **Dado** que um usuário autenticado tem o access token expirado, **quando** realiza qualquer ação na plataforma que exija autenticação, **então** o sistema usa o refresh token para obter um novo access token de forma transparente, sem interromper a experiência do usuário.
2. **Dado** que o refresh token de um usuário também está expirado ou inválido, **quando** o sistema tenta renová-lo, **então** o usuário é redirecionado para a tela de login com mensagem informando que a sessão expirou.
3. **Dado** que a role de um usuário foi alterada, **quando** o sistema processa a próxima renovação de token via refresh, **então** as novas permissões são aplicadas e o usuário é redirecionado para a área correspondente à nova role.

---

#### HU-04 — Acesso restrito por role

Um usuário autenticado não deve conseguir acessar áreas ou funcionalidades que não pertencem à sua role. Um adotante não deve ver o painel administrativo, e um administrador tentando acessar área não permitida deve ser redirecionado corretamente. Rotas que exigem autenticação devem redirecionar visitantes para o login.

**Pode ser testada independentemente:** Sim. É possível tentar acessar diretamente a URL de uma rota protegida com um usuário da role errada e verificar o comportamento de bloqueio e redirecionamento.

**Cenários de aceite:**

1. **Dado** que um visitante não autenticado tenta acessar uma rota protegida, **quando** a tentativa ocorre, **então** é redirecionado para a tela de login.
2. **Dado** que um adotante autenticado tenta acessar uma rota do painel administrativo, **quando** a tentativa ocorre, **então** é redirecionado para a área de adotante com mensagem de acesso não autorizado.
3. **Dado** que um administrador autenticado acessa a plataforma, **então** o layout exibido é o layout administrativo, diferente do layout exibido para adotantes.

---

### Regras de Negócio

- **RN-01:** Todo novo usuário criado via formulário de cadastro recebe automaticamente a role `adotante`. Nenhum usuário pode escolher sua própria role durante o cadastro.
- **RN-02:** Uma conta só pode ser usada para login após confirmação por email. Contas não confirmadas estão bloqueadas para autenticação.
- **RN-03:** O link de confirmação de conta tem prazo de validade. Após a expiração, o usuário deve solicitar reenvio do email. O prazo exato é uma decisão técnica a ser definida, com sugestão de 24 horas.
- **RN-04:** O sistema não deve revelar se um email existe ou não no banco de dados em mensagens de erro de login ou cadastro, evitando enumeração de usuários.
- **RN-05:** O email de confirmação de conta deve ter referência visual ao sistema CatDog: cores laranja e roxo, padrão de patinhas no fundo, logo CatDog.
- **RN-06:** O access token tem tempo de vida curto (sugestão: 15 minutos). O refresh token tem tempo de vida maior (sugestão: 7 dias) e é usado exclusivamente para renovar o access token.
- **RN-07:** No momento da renovação do access token via refresh token, o sistema deve reverificar a role e o status da conta do usuário. Se a conta for desativada ou a role alterada, as novas condições devem ser aplicadas imediatamente.
- **RN-08:** Cada role tem um layout próprio e um conjunto de rotas permitidas: adotantes acessam a área de consulta e solicitação de adoção; administradores acessam o painel de gestão. Acesso cruzado não é permitido.
- **RN-09:** Senha deve ter no mínimo 8 caracteres. Regras adicionais de complexidade são uma premissa a confirmar com o time.
- **RN-10:** Os campos "Senha" e "Confirmar Senha" devem ser idênticos para que o cadastro seja aceito.
- **RN-11:** O campo "Email" deve ter formato válido de endereço de email.
- **RN-12:** O campo "Nome" é obrigatório e deve ter no mínimo 2 caracteres.

---

### Requisitos Funcionais

#### O que o sistema exibe ao ser acessado

A tela inicial da plataforma para usuários não autenticados é a tela de Login. Ela exibe:
- Logo CatDog (gato laranja com texto)
- Campo "Email"
- Campo "Senha" com ícone de toggle de visibilidade
- Link "Esqueceu sua senha?" (fora do escopo desta feature — reservado para feature futura)
- Botão "Entrar" (roxo preenchido)
- Link "Não tem uma conta? Cadastre-se"
- Fundo cinza claro com padrão de patinhas watermark

#### Ações disponíveis

**Ação 1 — Login**

O usuário informa email e senha e clica em "Entrar".

Regras condicionais:
- Se email e senha correspondem a uma conta confirmada com role `adotante` → autentica e redireciona para a área de adotante com layout de adotante
- Se email e senha correspondem a uma conta confirmada com role `admin` → autentica e redireciona para o painel administrativo com layout de administrador
- Se email ou senha estão incorretos → exibe mensagem de erro genérica sem indicar qual campo está errado (RN-04)
- Se a conta existe mas não foi confirmada → exibe mensagem informando que a conta não foi confirmada e oferece reenvio do email de confirmação
- Se os campos obrigatórios estão vazios → os campos são destacados com estado de erro antes de submeter

**Ação 2 — Navegar para o Cadastro**

O visitante clica no link "Não tem uma conta? Cadastre-se" na tela de Login.

Regras condicionais:
- O sistema navega para a tela de Cadastro

**Ação 3 — Cadastro de novo adotante**

A tela de Cadastro exibe:
- Campo "Nome"
- Campo "Email"
- Campo "Senha"
- Campo "Confirmar Senha"
- Botão "Cadastrar" (roxo preenchido)
- Botão "Voltar" (roxo outline)

O visitante preenche os campos e clica em "Cadastrar".

Regras condicionais:
- Se todos os campos passam nas validações → conta é criada com role `adotante`, email de confirmação é enviado, sistema exibe mensagem de sucesso informando que um email foi enviado para o endereço informado
- Se o email já está cadastrado → mensagem de erro genérica (RN-04)
- Se senhas não coincidem → mensagem de erro no campo "Confirmar Senha"
- Se qualquer campo obrigatório estiver vazio ou inválido → os campos são destacados com estado de erro
- Se o usuário clica em "Voltar" → retorna para a tela de Login sem salvar

**Ação 4 — Confirmação de conta via email**

O adotante recebe um email de confirmação com referência visual CatDog e clica no link contido nele.

Regras condicionais:
- Se o link é válido e está dentro do prazo → conta é ativada, adotante é redirecionado para a tela de Login com mensagem de sucesso confirmando a ativação da conta
- Se o link expirou → sistema exibe mensagem informando expiração e oferece reenvio de novo email de confirmação
- Se o link já foi utilizado anteriormente → sistema exibe mensagem informando que a conta já foi confirmada e direciona para o Login

**Ação 5 — Renovação automática de sessão**

Quando o access token do usuário expira durante a sessão ativa, o sistema tenta renovação automática.

Regras condicionais:
- Se o refresh token é válido → novo access token é gerado, as permissões são reverificadas, a sessão continua sem interrupção
- Se o refresh token expirou ou é inválido → usuário é redirecionado para a tela de Login com mensagem informando que a sessão expirou
- Se a role do usuário foi alterada desde o último token → novas permissões são aplicadas e, se necessário, o usuário é redirecionado para a área correta da nova role

---

#### Validações e Restrições

- "Nome" é obrigatório e deve ter no mínimo 2 caracteres.
- "Email" é obrigatório e deve ter formato válido de endereço de email.
- "Senha" é obrigatória e deve ter no mínimo 8 caracteres.
- "Confirmar Senha" é obrigatória e deve ser idêntica ao campo "Senha".
- Nenhum usuário pode se cadastrar como `admin` via formulário público.
- O botão "Cadastrar" deve ser desabilitado ou exibir feedback de loading enquanto a submissão está em andamento, para evitar duplo envio.
- O botão "Entrar" deve ser desabilitado ou exibir feedback de loading enquanto a autenticação está em andamento.

---

#### Mensagens ao Usuário

| Condição | Mensagem |
|---|---|
| Cadastro realizado com sucesso | 'Conta criada! Enviamos um email de confirmação para [email]. Verifique sua caixa de entrada.' |
| Email já cadastrado | 'Não foi possível criar a conta. Verifique os dados informados.' |
| Login com credenciais inválidas | 'Email ou senha inválidos. Verifique os dados e tente novamente.' |
| Tentativa de login com conta não confirmada | 'Sua conta ainda não foi confirmada. Verifique seu email ou solicite o reenvio.' |
| Link de confirmação expirado | 'Este link de confirmação expirou. Solicite um novo email de confirmação.' |
| Link de confirmação já utilizado | 'Esta conta já foi confirmada. Faça login para continuar.' |
| Confirmação de conta bem-sucedida | 'Conta confirmada com sucesso! Faça login para continuar.' |
| Sessão expirada (refresh inválido) | 'Sua sessão expirou. Faça login novamente.' |
| Campo obrigatório vazio | 'Este campo é obrigatório.' |
| Senhas não coincidem | 'As senhas não coincidem.' |
| Email com formato inválido | 'Informe um endereço de email válido.' |
| Senha abaixo do mínimo | 'A senha deve ter no mínimo 8 caracteres.' |
| Nome abaixo do mínimo | 'O nome deve ter no mínimo 2 caracteres.' |

---

#### Integrações

| Sistema externo | O que é enviado | O que é recebido | Em caso de falha |
|---|---|---|---|
| Serviço de email transacional | Nome do destinatário, endereço de email, link de confirmação com token único | Confirmação de entrega (opcional) | Exibir mensagem ao usuário informando que o email pode demorar e permitir reenvio após um intervalo mínimo |

---

### Requisitos Não Funcionais

| ID | Tipo | Requisito | Critério mensurável |
|---|---|---|---|
| RNF-01 | Segurança | Senhas nunca devem ser armazenadas em texto claro; devem ser protegidas com algoritmo de hash seguro | Zero senhas em texto claro no banco de dados; auditoria confirma uso de hash |
| RNF-02 | Segurança | Tokens de acesso e refresh devem ser armazenados de forma segura no dispositivo, usando armazenamento criptografado | Tokens não acessíveis via mecanismos não seguros de armazenamento |
| RNF-03 | Segurança | O link de confirmação de conta deve conter um token único e de uso único, com prazo de validade | Links utilizados ou expirados rejeitados pelo sistema; nenhum link reutilizável após o uso |
| RNF-04 | Desempenho | O fluxo de login deve completar e redirecionar o usuário de forma perceptivelmente ágil | Usuário percebe resposta em condições normais de rede sem espera prolongada |
| RNF-05 | Usabilidade | Mensagens de erro não devem revelar informações sobre a existência de emails no sistema | Testes de enumeração de usuário não produzem informação diferenciada |
| RNF-06 | Disponibilidade | A renovação de token não deve causar interrupções visíveis para o usuário durante o uso normal | Nenhuma tela de loading ou redirecionamento inesperado durante renovação automática de sessão |

---

### O que Não Deve Ser Feito

- Esta feature não inclui recuperação de senha ("Esqueceu sua senha?") — este fluxo será especificado em feature separada.
- Esta feature não permite a criação de contas de administrador via formulário público.
- Esta feature não inclui login social (Google, Facebook, etc.).
- Esta feature não envia notificações push, SMS ou qualquer comunicação além do email de confirmação de conta.
- Esta feature não exibe ao usuário a listagem de contas existentes nem confirma a existência de um email específico em mensagens de erro.
- Esta feature não gerencia a revogação de sessões em múltiplos dispositivos simultaneamente.

---

## Grupo 4 — Validação

### Casos de Teste

| ID | Cenário | Entrada | Resultado esperado | Tipo |
|---|---|---|---|---|
| CT-01 | Cadastro com todos os dados válidos | Nome: "Maria Silva", Email: "maria@email.com" (novo), Senha: "Senha@123", Confirmar Senha: "Senha@123" | Conta criada com role adotante; email de confirmação enviado; mensagem de sucesso exibida | Positivo |
| CT-02 | Cadastro com email já existente | Email já cadastrado no sistema | Mensagem de erro genérica; conta não criada | Negativo |
| CT-03 | Cadastro com senhas diferentes | Senha: "Senha@123", Confirmar Senha: "Senha@321" | Erro no campo "Confirmar Senha"; formulário não submetido | Negativo |
| CT-04 | Cadastro com campo Nome vazio | Nome: "" | Erro de campo obrigatório; formulário não submetido | Negativo |
| CT-05 | Cadastro com email formato inválido | Email: "nao-e-email" | Erro de formato inválido; formulário não submetido | Negativo |
| CT-06 | Cadastro com senha abaixo do mínimo | Senha: "123" | Erro de senha muito curta; formulário não submetido | Negativo |
| CT-07 | Confirmação de conta com link válido | Link de confirmação gerado há menos de 24h | Conta ativada; redirecionamento para login com mensagem de sucesso | Positivo |
| CT-08 | Confirmação com link expirado | Link gerado há mais de 24h | Mensagem de link expirado; opção de reenvio exibida | Negativo |
| CT-09 | Confirmação com link já utilizado | Link usado anteriormente | Mensagem de conta já confirmada; direcionamento ao login | Borda |
| CT-10 | Login com credenciais válidas — adotante | Email e senha corretos de conta adotante confirmada | Autenticação; redirecionamento para área de adotante com layout de adotante | Positivo |
| CT-11 | Login com credenciais válidas — admin | Email e senha corretos de conta admin confirmada | Autenticação; redirecionamento para painel administrativo com layout de admin | Positivo |
| CT-12 | Login com senha errada | Email válido, senha incorreta | Mensagem de erro genérica; sem indicação de qual campo está errado | Negativo |
| CT-13 | Login com conta não confirmada | Email e senha corretos de conta não confirmada | Mensagem informando falta de confirmação; opção de reenvio exibida | Negativo |
| CT-14 | Toggle de visibilidade de senha no login | Clique no ícone de visibilidade do campo senha | Senha exibida em texto claro; clique novamente oculta a senha | Positivo |
| CT-15 | Acesso a rota protegida sem autenticação | Tentativa de navegar para rota autenticada sem token | Redirecionamento para tela de login | Negativo |
| CT-16 | Adotante tenta acessar rota de admin | Usuário com role adotante acessa rota do painel admin | Bloqueio; redirecionamento para área de adotante | Negativo |
| CT-17 | Renovação automática com refresh válido | Access token expirado, refresh token válido | Nova sessão estabelecida sem interrupção; usuário não percebe troca de token | Positivo |
| CT-18 | Renovação com refresh expirado | Access token expirado e refresh token expirado | Redirecionamento para login com mensagem de sessão expirada | Negativo |
| CT-19 | Role alterada durante sessão ativa | Role do usuário muda no sistema durante sessão ativa; próximo refresh ocorre | Novas permissões aplicadas; redirecionamento para área correspondente à nova role | Borda |
| CT-20 | Botão "Voltar" na tela de Cadastro | Clique em "Voltar" com campos preenchidos | Retorna para tela de Login sem criar conta | Positivo |

---

### Critérios de Aceite

**Comportamento e entrega:**
- [ ] CA-01: O visitante consegue criar uma conta informando nome, email, senha e confirmação de senha e recebe um email de confirmação.
- [ ] CA-02: A conta de adotante só permite login após a confirmação via link enviado por email.
- [ ] CA-03: O email de confirmação contém referência visual ao sistema CatDog (cores laranja/roxo, patinhas, logo).
- [ ] CA-04: Após login bem-sucedido, o adotante é redirecionado para a área de adotante com o layout de adotante.
- [ ] CA-05: Após login bem-sucedido, o administrador é redirecionado para o painel administrativo com o layout de administrador.
- [ ] CA-06: Mensagens de erro de login não revelam se o email existe na base ou qual campo está incorreto.
- [ ] CA-07: O campo senha possui toggle de visibilidade funcional na tela de Login.
- [ ] CA-08: O access token é renovado automaticamente via refresh token sem interrupção visível ao usuário.
- [ ] CA-09: Quando o refresh token expira, o usuário é redirecionado para o login com mensagem explicativa.
- [ ] CA-10: As permissões da role são reverificadas a cada renovação de token.
- [ ] CA-11: Um adotante não consegue acessar rotas do painel administrativo.
- [ ] CA-12: Um visitante não autenticado é redirecionado para o login ao tentar acessar qualquer rota protegida.
- [ ] CA-13: O link de confirmação expirado não ativa a conta e oferece reenvio.

**Regressão:**
- [ ] Não aplicável no MVP — esta é a feature base de autenticação da qual todas as demais dependem.

**Qualidade de código (SonarQube):**
- [ ] Quality Gate aprovado sem bloqueadores
- [ ] Cobertura de testes: mínimo de 80% nas classes alteradas
- [ ] Zero issues de segurança (Severity: Blocker ou Critical)

---

### Critério de Sucesso da Feature

| Métrica | Baseline atual | Meta após entrega | Como será medida |
|---|---|---|---|
| Cadastros completados com confirmação de email | 0 (não existe sistema) | 100% dos cadastros iniciados e confirmados chegam ao primeiro login com sucesso | Verificação manual em ambiente de testes |
| Taxa de falha no fluxo de login para usuários válidos | 0 (não existe sistema) | 0% de falhas para credenciais corretas com conta confirmada | Testes automatizados e validação em homologação |
| Redirecionamento correto por role | 0 (não existe sistema) | 100% dos logins redirecionam para a área correta da role | Testes de aceite por perfil |

---

## Grupo 5 — Estimativa

> Preencha após o escopo completo estar definido e revisado.

**Use Points gerados:** _A preencher_
**Estimativa de custo:** _A preencher_
