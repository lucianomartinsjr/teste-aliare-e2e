
context('Avaliação Técnica - Scripts de Testes E2E (BUGBANK)', () => {
    //hooks -> executar antes ou depois dos testes
    //before, after, beforeEach, afterEach

    beforeEach(() => {
      cy.visit("https://bugbank.netlify.app/", { failOnStatusCode: false });
    });

    describe('(CD) Cadastro', () => {
      it('CD.1: Cadastro com e-mail inválido', () => {
        cy.get('.ihdmxA').click()
        cy.get(':nth-child(2) > .input__default')
          .type("email_errado.com",{force:true})
        cy.get('.kOeYBn > .input__warging')
          .should('include.text','Formato inválido')
      });
    
      it('CD.2: Cadastro com e-mail válido', () => {
       criarConta("teste@teste.com","Luciano","senha","senha")
      });
    });
  
    describe('(LG) Login', () => {
      it('LG.1: Login com e-mail inválido', () => {
        cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > :nth-child(1) > .input__default')
        .type("email_errado.com")
        cy.get('.kOeYBn > .input__warging')
        .should('include.text','Formato inválido')
      });
  
      it('LG.2: Login com e-mail inválido/senha não cadastrados', () => {
        cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > :nth-child(1) > .input__default')
        .type("emailerrado@email.com")
        cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > .login__password > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default')
        .type("senha123")
        cy.get('.otUnI')
          .click()
        cy.get('#modalText')
          .contains("Usuário ou senha inválido. Tente novamente ou verifique suas informações!")
  
      });
      
      it('LG.3: Login com usuário/senha válidos', () => {

        criarConta("teste@teste.com", "Luciano", "senha", "senha");
        
        cy.get('@numeroConta').then((numeroConta) => {
          realizarLogin("teste@teste.com", "senha");
          cy.get('#textName')
            .contains('Luciano');
          cy.get('#textAccountNumber')
            .should('contain', numeroConta);
        });
      });
    });

    describe('(EX) Extrato', () => {
      it('EX.1: Validar extrato com saldo zerado', () => {
        criarConta("teste@teste.com", "Luciano", "senha", "senha");
        realizarLogin("teste@teste.com", "senha");  
        cy.get('#btn-EXTRATO')
          .click();
        cy.get('#textBalanceAvailable')
          .contains('R$ 0,00')
        cy.get('#textDescription')
          .contains('Cliente optou por não ter saldo ao abrir conta');
      });

      it('EX.2: Validar criação de saldo com saldo', () => {
        criarConta("teste@teste.com", "Luciano", "senha", "senha",true);
        realizarLogin("teste@teste.com", "senha");
        cy.get('#btn-EXTRATO').click();
        cy.get('#textBalanceAvailable')
        .contains('R$ 1.000,00')
      });

      it('EX.3: Validar se botão voltar está visivel e redirecionando a tela inicial', () => {
        criarConta("teste@teste.com", "Luciano", "senha", "senha",true);
        realizarLogin("teste@teste.com", "senha");
        cy.get('#btn-EXTRATO').click();
        cy.get('#btnBack').should('be.visible')

        cy.get('#btnBack').click()
        cy.url().should('eq', 'https://bugbank.netlify.app/home')
      });

      it('EX.4: Validar consistência do extrato após movimentação', () => {
        criarConta("teste@teste.com", "Luciano", "senha", "senha",true);
        criarConta("teste2@teste.com", "Junior", "senha", "senha");
        cy.get('@numeroConta').then((numeroConta) => {
          realizarLogin("teste@teste.com", "senha")

          cy.get('#btn-TRANSFERÊNCIA').click()
          const [numero, agencia] = numeroConta.split('-');
          
          realizarTransferencia(numero,agencia,275,"EX.4")
          cy.get('#btnCloseModal')
            .click()
          realizarTransferencia(numero,agencia,187,"EX.4")
          cy.get('#btnCloseModal')
            .click()

          cy.get('#btnBack').click()

          cy.get('#btn-EXTRATO').click()
          
  
          cy.get('#textBalanceAvailable').then(($saldoDisponivel) => {
            const saldoDisponivel = parseFloat($saldoDisponivel.text().replace('R$', '').trim());
            
            let totalMovimentacoes = 0;

            cy.get('.bank-statement__ContainerTransaction-sc-7n8vh8-12')
              .find('.bank-statement__Transaction-sc-7n8vh8-13')
              .each(($transaction, index) => {
                cy.wrap($transaction)
                  .find('.bank-statement__ContainerDescAndValue-sc-7n8vh8-15 > #textTransferValue')
                  .invoke('text')
                  .then((value) => {
                    cy.log(`Valor original na transação ${index}: ${value}`);
                  
                    const valoresNumericos = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
                    cy.log(`Valor numérico na transação ${index}: ${valoresNumericos}`);
                    totalMovimentacoes += valoresNumericos;
                  });
              })
              .then(() => {
                cy.log(`Total dos valores de textTransferValue: ${totalMovimentacoes}`);
                expect(totalMovimentacoes).to.equal(saldoDisponivel);
              });             

          });

        });
      });
    });
  describe('(TR) Transferencia', () => {
    it('TR.1 Transfêrencia com conta inválida ou inexistente ', () => {
      criarConta("teste@teste.com", "Luciano", "senha", "senha",true);
      realizarLogin("teste@teste.com", "senha");
      cy.get('#btn-TRANSFERÊNCIA').click()

      realizarTransferencia("154","5",500,"teste conta invalida")
      
      cy.get('#modalText')
        .should('have.text','Conta inválida ou inexistente')

    });

    it('TR.2 Transferência com valor inválido', () => {
      criarConta("teste@teste.com", "Luciano", "senha", "senha",true);
      realizarLogin("teste@teste.com", "senha");
      cy.get('#btn-TRANSFERÊNCIA').click()

      realizarTransferencia("1542","52","-500","teste valor invalido")

      cy.get('#modalText')
        .should('have.text','Valor da transferência não pode ser 0 ou negativo')

    });

    it('TR.3 Tranferencia concluida com sucesso', () => {
      criarConta("teste@teste.com", "Luciano", "senha", "senha",true);

      criarConta("teste2@teste.com", "Junior", "senha", "senha");

      cy.get('@numeroConta').then((numeroConta) => {
        realizarLogin("teste@teste.com", "senha")
        cy.get('#btn-TRANSFERÊNCIA').click()

        const [numero, agencia] = numeroConta.split('-');

        realizarTransferencia(numero,agencia,500,"TR.3")
        
        cy.get('.styles__ContainerInformations-sc-8zteav-3').should('be.visible')

        cy.get('#modalText')
        .should('have.text','Transferencia realizada com sucesso')
      });
    });

    it('TR.4 - Validar se botão Voltar está visivel e redirecionando a tela inicial', () => {
      criarConta("teste@teste.com", "Luciano", "senha", "senha",true);
      realizarLogin("teste@teste.com", "senha");
      
      cy.get('#btn-TRANSFERÊNCIA').click();
      cy.get('#btnBack').should('be.visible')

      cy.get('#btnBack').click()
      cy.url().should('eq', 'https://bugbank.netlify.app/home')
    });
  });
});

function criarConta(email,nome,senha,confSenha,saldo=false){
  cy.get('.ihdmxA').click()
  cy.get(':nth-child(2) > .input__default')
    .clear({force:true}).type(email, { force: true });
  cy.get(':nth-child(3) > .input__default')
    .clear({force:true}).type(nome, { force: true });
  cy.get(':nth-child(4) > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default')
    .clear({force:true}).type(senha, { force: true });
  cy.get(':nth-child(5) > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default')
    .clear({force:true}).type(confSenha, { force: true });


    if (saldo) {
      cy.get('#toggleAddBalance').click({force:true});
    } 
  
  cy.get('.styles__ContainerFormRegister-sc-7fhc7g-0 > .style__ContainerButton-sc-1wsixal-0')
    .click({force: true})
    cy.get('#modalText').should('contain', 'A conta').and('contain', 'foi criada com sucesso').then(($modalText) => {
      const numeroContaMatch = $modalText.text().match(/A conta (\d+-\d+)/);
      if (numeroContaMatch && numeroContaMatch.length > 1) {
        const numeroConta = numeroContaMatch[1];
        cy.wrap(numeroConta).as('numeroConta');
      } else {
        cy.log('Número da conta não encontrado na mensagem.');
      }
    });
  cy.get('#btnCloseModal').click({force:true})

}

function realizarLogin(email,senha){
  cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > :nth-child(1) > .input__default')
  .should('be.visible')
  .type(email)
  cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > .login__password > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default')
  .should('be.visible')
  .type(senha)
  cy.get('.otUnI').click()
}

function realizarTransferencia(numero,agencia,valor,descricao){
  cy.get(':nth-child(1) > .input__default')
    .clear({force:true}).type(numero)
  cy.get('.account__data > :nth-child(2) > .input__default')
    .clear({force:true}).type(agencia)
  cy.get('.styles__ContainerFormTransfer-sc-1oow0wh-0 > :nth-child(2) > .input__default')
    .clear({force:true}).type(valor)
  cy.get(':nth-child(3) > .input__default')
    .clear({force:true}).type(descricao)
  cy.get('.style__ContainerButton-sc-1wsixal-0')
    .click()
}
