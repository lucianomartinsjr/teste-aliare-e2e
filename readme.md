# BugBank - Testes E2E com Cypress

## Instalação

Antes de executar os testes, certifique-se de ter o Cypress instalado. Execute o seguinte comando no terminal:

```
npm install cypress --save-dev
```
## Executando os Testes

````
npx cypress run
````

Isso iniciará o Cypress e executará todos os testes automaticamente.

## Ambiente de Teste

Testes Implementados
Cadastro (CD)

    CD.1: Cadastro com e-mail inválido
        Acesse a aplicação
        Clique no botão 'Registrar'  -> Resultado esperado: Sistema deve apresentar a tela de cadastros
       Informe o e-mail "email_errado.com" -> Resultado esperado: Sistema deve apresentar a mensagem "Formato inválido" abaixo do campo de e-mail

    CD.2: Cadastro com e-mail válido
        Acesse a aplicação
        Clique no botão 'Registrar' -> Resultado esperado: Sistema deve apresentar a tela de cadastros
        Informe o e-mail 'test@test.com'
        Informe um nome válido
        Informe uma senha válida
        Repita a senha informada no passo 5
        Marque a opção 'Criar conta com saldo?'
        Clicar em 'Cadastrar' -> Resultado esperado: Sistema deve cadastrar o usuário sem erros

Login (LG)

    LG.1: Login com e-mail inválido
        Acesse a aplicação
        Informe o e-mail 'email_errado.com -> Resultado esperado: Sistema deve exibir a mensagem 'Formato inválido' abaixo do campo de e-mail

    LG.2: Login com e-mail inválido/senha não cadastrados
        Acesse a aplicação
        Informe um e-mail que não estava cadastrado
        Informe uma senha qualquer
        Clique em 'Acessar' -> Resultado esperado: Sistema deve apresentar a mensagem "Usuário ou senha inválido. Tente novamente ou verifique suas informações!

    LG.3: Login com usuário/senha válidos
        Acesse a aplicação
        Informe um e-mail previamente cadastrado
        Informe a senha correta para o e-mail cadastrado
        Clique em 'Acessar' -> Resultado esperado: Sistema deve apresentar o nome do usuário corretamente
        Verifica se o nome do usuário e o número da conta são exibidos corretamente.

Extrato (EX)

    EX.1: Validar extrato com saldo zerado
        Cria uma conta com saldo zerado.
        Realiza login.
        Acessa o extrato e verifica se o saldo disponível é zero -> Resultado esperado: Sistema deve apresentar saldo disponível como zero

    EX.2: Validar criação de saldo com saldo
        Cria uma conta com saldo inicial de R$ 1.000,00.
        Realiza login.
        Acessa o extrato e verifica se o saldo disponível é R$ 1.000,00 -> Resultado esperado: Sistema deve apresentar saldo disponível como R$ 1.000,00

    EX.3: Validar se botão voltar está visível e redirecionando a tela inicial
        Cria uma conta com saldo.
        Realiza login.
        Acessa o extrato
        Verifica se o botão "Voltar" está visível -> Resultado esperado: Sistema deve apresentar o botão "Voltar" visível
        Utiliza o botão "Voltar" -> Resultado esperado: Sistema deve redirecionar para a tela inicial


    EX.4: Validar consistência do extrato após transferência
        Cria duas contas.
        Realiza transferências entre as contas.
        Realiza login na conta de origem
        Acessar o extrato
        Verificar se o extrato reflete corretamente as transações.

Transferência (TR)

    TR.1: Transferência com conta inválida ou inexistente
        Cria uma conta.
        Realiza login.
        Tenta realizar uma transferência com uma conta inválida 
        Verifica se é exibida a mensagem de conta inválida ou inexistente -> Resultado esperado: Sistema deve exibir a mensagem "Conta inválida ou inexistente" 

    TR.2: Transferência com valor inválido
        Cria uma conta.
        Realiza login.
        Tenta realizar uma transferência com um valor inválido. -> Resultado esperado: Sistema deve exibir a mensagem "Valor da transferência não pode ser 0 ou negativo"
      
    TR.3: Transferência concluída com sucesso
        Cria duas contas.
        Realiza login na conta de origem.
        Realiza uma transferência para a segunda conta. -> Resultado esperado: Sistema deve exibir a mensagem "Transferência realizada com sucesso"
     

    TR.4: Validar se botão Voltar está visível e redirecionando a tela inicial
        Cria uma conta.
        Realiza login.
        Acessa a página de transferência
        Verifica se o botão "Voltar" está visível -> Resultado esperado: Sistema deve apresentar o botão "Voltar" visível
        Utiliza o botão "Voltar" -> Resultado esperado:	Sistema deve redirecionar para a tela inicial