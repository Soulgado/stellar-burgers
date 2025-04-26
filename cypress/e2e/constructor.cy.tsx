import data from '../ingredients.json';
const URL = process.env.BURGER_API_URL;

describe('testing constructor page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
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
    const button = cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('button');
    });
    button.contains('Добавить');
    button.click();

    // check for bun inside the constructor
    cy.get('#burger-constructor').within(() => {
      cy.get(`[data-cy=bun-${data[0]._id}]`);
    });
  });

  it('ingredients can be added to constructor', () => {
    const testIngredient = data.find((i) => i.type === 'main');
    const button = cy.get(`[data-cy=${testIngredient!._id}]`).within(() => {
      cy.get('button');
    });
    button.contains('Добавить');
    button.click();

    cy.get('#burger-constructor').within(() => {
      cy.get(`[data-cy=ingr-${testIngredient!._id}]`);
    });
  });
});

describe('testing modal windows', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
  });

  it('open ingredient modal window', () => {
    const ingrElement = cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('a');
    });
    ingrElement.click();

    cy.get('#modals').contains(`${data[0].name}`);
  });

  it('modal window is closed on click on cross', () => {
    const ingrElement = cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('a');
    });
    ingrElement.click();
    cy.get('#modals').find('button').click();

    cy.get('#modals').should('be.empty');
  });

  it('modal window should close on click on overlay', () => {
    const ingrElement = cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('a');
    });
    ingrElement.click();
    // click on top-left corner of the screen, so outside modal
    cy.get('body').click(0, 0);
  });
});

describe.only('order logic is correct', () => {
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
    cy.visit('http://localhost:4000/');
    const bunButton = cy.get(`[data-cy=${data[0]._id}]`).within(() => {
      cy.get('button');
    });
    bunButton.contains('Добавить');
    bunButton.click();

    const testIngredient = data.find((i) => i.type === 'main');
    const ingrButton = cy.get(`[data-cy=${testIngredient!._id}]`).within(() => {
      cy.get('button');
    });
    ingrButton.contains('Добавить');
    ingrButton.click();

    cy.contains('button', 'Оформить заказ').click();

    cy.get('#modals').should('not.be.empty');
    cy.get('#modals').should('contain.text', 'идентификатор заказа');
    cy.get('#modals').should('contain.text', 12345);

    cy.get('#modals').find('button').click();

    cy.get('#modals').should('be.empty');

    cy.get('#burger-constructor').should('contain.text', 'Выберите булки');
    cy.get('#burger-constructor').should('contain.text', 'Выберите начинку')
  });
});
