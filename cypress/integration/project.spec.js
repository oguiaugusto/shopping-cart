const fetchMock = require('../mocks/fetch')
const products = require('../mocks/computerCategory')
const PROJECT_URL = './index.html'

const LOADING = '.loader';
const ITEM_SELECTOR = '.item';
const ADD_CART_BUTTON = '.item__add'
const CART_ITEMS = '.cart__items'
const EMPTY_CART_BUTTON = '.empty-cart'
const TOTAL_PRICE = '.total-price'

let results = products.results

const addToCart = (index) => {
  cy.get(ITEM_SELECTOR)
    .should('exist')
    .eq(index)
    .children(ADD_CART_BUTTON)
    .click();
}

const countCart = (amount) => {
  cy.get(CART_ITEMS)
      .children()
      .should('have.length', amount);
}

const checkPrice = (results, indexes) => {
  console.log(results)
  cy.wait(1000);
  let total = 0;
  indexes.forEach(index => total += results[index].price);
  cy.get(TOTAL_PRICE)
      .should('have.text', total.toFixed(2).toString());
}

describe('Shopping Cart Project', () => {
  beforeEach(() => {
    cy.visit(PROJECT_URL, {
      onBeforeLoad(win) {
        win.fetch = fetchMock;
      },
    });
    cy.clearLocalStorage();
  });

  describe('1 - Crie uma listagem de produtos', () => {
    it('Listagem de produtos', () => {
      cy.get(ITEM_SELECTOR)
        .should('exist')
        .should('have.length', results.length);
    });    
  });

  describe('2 - Adicione o produto ao carrinho de compras', () => {
    it('Adicione o produto ao carrinho de compras',() => {
      cy.wait(1000);
      addToCart(36);
      countCart(1);
      console.log(results[36].id, results[36].title)
      cy.get(CART_ITEMS)
        .children()
        .should('contain', `${results[36].title}`)
        .and('contain', `${results[36].price}`)
        .and('have.id', `${results[36].id}`)
    });
  });
  
  describe('3 - Remova o item do carrinho de compras ao clicar nele', () => {
    it('Remova o item do carrinho de compras ao clicar nele', () => {
      addToCart(29);
      addToCart(31);
      addToCart(15);

      cy.get(CART_ITEMS)
        .children()
        .eq(1)
        .children()
        .last()
        .children()
        .first()
        .click()
      countCart(2);

      cy.get(CART_ITEMS)
        .children()
        .eq(1)
        .children()
        .last()
        .children()
        .first()
        .click()
      countCart(1);

      cy.get(CART_ITEMS)
        .children()
        .eq(0)
        .children()
        .last()
        .children()
        .first()
        .click()
      countCart(0);
    });
  });

  describe('4 - Carregue o carrinho de compras atrav??s do **LocalStorage** ao iniciar a p??gina', () => {
    it('Carregue o carrinho de compras atrav??s do **LocalStorage** ao iniciar a p??gina', () => {
      let first = 36;
      let last = 29;

      addToCart(first);
      cy.wait(1000);

      countCart(1);

      cy.get(CART_ITEMS)
        .children()
        .should('contain', `${results[first].title}`)
        .and('contain', `${results[first].price}`)
        .and('have.id', `${results[first].id}`);
       
      addToCart(last);
      cy.wait(1000);

      cy.get(CART_ITEMS)
        .children()
        .last()
        .should('contain', `${results[last].title}`)
        .and('contain', `${results[last].price}`)
        .and('have.id', `${results[last].id}`);
  
      cy.reload({
        onBeforeLoad(win) {
          win.fetch = fetchMock;
        },
      });

      cy.get(CART_ITEMS)
        .children()
        .should('contain', `${results[first].title}`)
        .and('contain', `${results[first].price}`)
        .and('have.id', `${results[first].id}`);

        cy.get(CART_ITEMS)
        .children()
        .last()
        .should('contain', `${results[last].title}`)
        .and('contain', `${results[last].price}`)
        .and('have.id', `${results[last].id}`);
    });

    it('Dever?? ser poss??vel remover items do carrinho ao clicar sobre eles mesmo ap??s regarregar a p??gina', () => {
      addToCart(29);
      addToCart(31);
      addToCart(15);

      cy.reload({
        onBeforeLoad(win) {
          win.fetch = fetchMock;
        },
      });

      cy.get(CART_ITEMS)
        .children()
        .eq(1)
        .children()
        .last()
        .children()
        .first()
        .click()
      countCart(2);

      cy.get(CART_ITEMS)
        .children()
        .eq(1)
        .children()
        .last()
        .children()
        .first()
        .click()
      countCart(1);

      cy.get(CART_ITEMS)
        .children()
        .eq(0)
        .children()
        .last()
        .children()
        .first()
        .click()
      countCart(0);
    })
  });

  describe('5 - Some o valor total dos itens do carrinho de compras de forma ass??ncrona', () => {
    it('Some o valor total dos itens do carrinho de compras de forma ass??ncrona', () => {
      cy.visit(PROJECT_URL, {
        onBeforeLoad(win) {
          win.fetch = fetchMock;
        },
      });
      addToCart(5);
      checkPrice(results, [5]);
      addToCart(42);
      checkPrice(results, [5, 42]);
      addToCart(36);
      checkPrice(results, [5, 42, 36]);
      addToCart(15);
      checkPrice(results, [5, 42, 36, 15]);
      cy.get(CART_ITEMS)
        .children()
        .eq(1)
        .children()
        .last()
        .children()
        .first()
        .click()
      checkPrice(results, [5, 36, 15]);
    });
  });

  describe('6 - Crie um bot??o para limpar carrinho de compras', () => {
    it('Bot??o para limpar carrinho de compras', () => {
      addToCart(3);
      addToCart(0);
      addToCart(1);
      countCart(3);
      cy.get(EMPTY_CART_BUTTON)
        .click()
      countCart(0);
    });
  });

  describe('7 - Adicione um elemento com a classe `loader` durante uma requisi????o ?? API', () => {
    it('Adicionar um elemento com a classe "loader" durante uma requisi????o ?? API', () => {
      cy.visit(PROJECT_URL)
      cy.get(LOADING)
        .should('exist')
        .wait(3000)
        .should('not.exist');
    });
  });

  describe('8 - Desenvolva testes para atingir 40% de cobertura', () => {
    it('Verifica a cobertura de testes unit??rios', () => {
      cy.exec('npm run test:coverage -- --coverageReporters="json-summary" --testFailureExitCode=0');
      cy.readFile('coverage/coverage-summary.json').its('total.functions.pct').should('be.gte', 40.00);
    });
  });

  describe('9 - Desenvolva testes para atingir 60% de cobertura', () => {
    it('Verifica a cobertura de testes unit??rios', () => {
      cy.exec('npm run test:coverage -- --coverageReporters="json-summary" --testFailureExitCode=0');
      cy.readFile('coverage/coverage-summary.json').its('total.functions.pct').should('be.gte', 60.00);
    });
  });

  describe('10 - Desenvolva testes para atingir 80% de cobertura', () => {
    it('Verifica a cobertura de testes unit??rios', () => {
      cy.exec('npm run test:coverage -- --coverageReporters="json-summary" --testFailureExitCode=0');
      cy.readFile('coverage/coverage-summary.json').its('total.functions.pct').should('be.gte', 80.00);
    });
  });

  describe('11 - Desenvolva testes para atingir 100% de cobertura', () => {
    it('Verifica a cobertura de testes unit??rios', () => {
      cy.exec('npm run test:coverage -- --coverageReporters="json-summary" --testFailureExitCode=0');
      cy.readFile('coverage/coverage-summary.json').its('total.functions.pct').should('be.gte', 100.00);
    });
  });
});
