import { describe, expect, test } from '@jest/globals';
import { nanoid } from '@reduxjs/toolkit';
import {
  addIngredient,
  burgerReducer,
  removeIngredient,
  getIngerdients,
  orderBurger,
  getFeed,
  getUserOrders
} from './burgerReducer';
import data from '../../../cypress/ingredients.json';

describe('testing burger constructor reducer', () => {
  const burgerInitialState = {
    listOfIngedients: [],
    constructorItems: {
      bun: null,
      ingredients: []
    },
    ingredients: [],
    ingredientsLoading: false,
    orderBurgerLoading: false,
    currentOrder: null,
    currentDisplayedOrder: null,
    feed: {
      orders: [],
      total: 0,
      totalToday: 0
    },
    feedLoading: false,
    userOrders: []
  };

  const testBun = data.find((i) => i.type === 'bun');
  const testIngredient = data.find((i) => i.type === 'main');

  test('can add ingredient to state', () => {
    const newState = burgerReducer(
      burgerInitialState,
      addIngredient(testIngredient!)
    );

    const { constructorItems } = newState;
    expect(constructorItems.ingredients[0]).toMatchObject(testIngredient!);
  });

  test('can delete ingredient from state', () => {
    const testIngredientWithKey = {
      ...testIngredient!,
      key: nanoid()
    };
    const newState = burgerReducer(
      {
        ...burgerInitialState,
        constructorItems: {
          bun: null,
          ingredients: [testIngredientWithKey]
        }
      },
      removeIngredient(testIngredientWithKey)
    );

    const { constructorItems } = newState;
    expect(constructorItems.ingredients).toHaveLength(0);
  });
});

describe('testing async actions', () => {
  const burgerInitialState = {
    listOfIngedients: [],
    constructorItems: {
      bun: null,
      ingredients: []
    },
    ingredients: [],
    ingredientsLoading: false,
    orderBurgerLoading: false,
    currentOrder: null,
    currentDisplayedOrder: null,
    feed: {
      orders: [],
      total: 0,
      totalToday: 0
    },
    feedLoading: false,
    userOrders: []
  };

  const testBun = data.find((i) => i.type === 'bun');
  const testIngredient = data.find((i) => i.type === 'main');

  const mockOrder = {
    _id: '',
    status: 'done',
    name: 'mockOrder',
    createdAt: '',
    updatedAt: '',
    number: 12345,
    ingredients: [testBun?._id, testIngredient?._id]
  };

  test('should handle loading state', () => {
    const action = {
      type: getIngerdients.pending.type
    };
    const state = burgerReducer(burgerInitialState, action);
    expect(state.ingredientsLoading).toBe(true);
  });

  test('should store ingredients data', () => {
    const action = {
      type: getIngerdients.fulfilled.type,
      payload: [testBun, testIngredient]
    };
    const state = burgerReducer(burgerInitialState, action);
    expect(state.listOfIngedients).toEqual([testBun, testIngredient]);
    expect(state.ingredientsLoading).toBe(false);
  });

  test('should store current order data', () => {
    const action = {
      type: orderBurger.fulfilled.type,
      payload: {
        order: mockOrder
      }
    };
    const state = burgerReducer(burgerInitialState, action);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.orderBurgerLoading).toBe(false);
  });

  test('should store feed data', () => {
    const action = {
      type: getFeed.fulfilled.type,
      payload: {
        orders: [mockOrder],
        total: 1,
        totalToday: 1
      }
    };
    const state = burgerReducer(burgerInitialState, action);
    expect(state.feed).toEqual({
      orders: [mockOrder],
      total: 1,
      totalToday: 1
    });
    expect(state.feedLoading).toBe(false);
  });

  test('should store user orders data', () => {
    const action = {
      type: getUserOrders.fulfilled.type,
      payload: [mockOrder]
    };
    const state = burgerReducer(burgerInitialState, action);
    expect(state.userOrders).toEqual([mockOrder]);
  });
});
