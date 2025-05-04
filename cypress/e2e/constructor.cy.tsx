import data from '../ingredients.json';
const testUrl = 'http://localhost:4000/';
const modalSelector = '[data-cy="modals"]';
const burgerConstructorSelector = '[data-cy="burger-constructor"]';

describe('testing constructor page', () => {
  beforeEach(() => {
    cy.visit(testUrl);
  });
  it('api request returns correct mock data', () => {
    cy.intercept('GET', `/api/ingredients`, {
      statusCode: 200,
      body: data
    }).as('getIngredients');

    cy.wait('@getIngredients').then((interception) => {
      console.log(interception.request.body);
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.deep.equal(data);
    });
  });

  it('buns can be added to constructor', () => {
    // select bun and click 'add'
    cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    // check for bun inside the constructor
    cy.get(burgerConstructorSelector).within(() => {
      cy.get(`[data-cy=bun-${data[0]._id}]`);
    });
  });

  it('ingredients can be added to constructor', () => {
    const testIngredient = data.find((i) => i.type === 'main');
    cy.get(`[data-cy=${testIngredient!._id}]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get(burgerConstructorSelector).within(() => {
      cy.get(`[data-cy=ingr-${testIngredient!._id}]`);
    });
  });
});

describe('testing modal windows', () => {
  beforeEach(() => {
    cy.visit(testUrl);
  });

  it('open ingredient modal window', () => {
    cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('a').click();
    });

    cy.get(modalSelector).contains(`${data[0].name}`);
  });

  it('modal window is closed on click on cross', () => {
    cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('a').click();
    });
    cy.get(modalSelector).find('button').click();

    cy.get(modalSelector).should('be.empty');
  });

  it('modal window should close on click on overlay', () => {
    cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('a').click();
    });
    // click on top-left corner of the screen, so outside modal
    cy.get('body').click(0, 0);
  });
});

describe('order logic is correct', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/auth/user`, {
      statusCode: 200,
      body: {
        user: {
          email: 'mockmail@example.com',
          name: 'mockuser'
        }
      },
      headers: {
        Authorization: 'Bearer mock-token'
      }
    }).as('getUser');

    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: {
        order: {
          _id: 'id',
          status: 'done',
          name: 'burger',
          createdAt: '',
          updatedAt: '',
          number: 12345,
          ingredients: ['', '']
        },
        name: 'burger',
        success: true
      },
      delay: 1000
    }).as('orderBurger');
  });

  it('ordering burger is correct', () => {
    cy.visit(testUrl);
    cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    const testIngredient = data.find((i) => i.type === 'main');
    cy.get(`[data-cy=${testIngredient!._id}]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.contains('button', 'Оформить заказ').click();

    cy.get(modalSelector).should('not.be.empty');
    cy.get(modalSelector).should('contain.text', 'идентификатор заказа');
    cy.get(modalSelector).should('contain.text', 12345);

    cy.get(modalSelector).find('button').click();

    cy.get(modalSelector).should('be.empty');

    cy.get(burgerConstructorSelector).should('contain.text', 'Выберите булки');
    cy.get(burgerConstructorSelector).should(
      'contain.text',
      'Выберите начинку'
    );
  });
});
