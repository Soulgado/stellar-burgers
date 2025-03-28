import { getFeedsApi, getIngredientsApi, orderBurgerApi } from '@api';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TOrdersData
} from '@utils-types';

export type TIngredientWithKey = TIngredient & { key: string };

type TBurgerState = {
  listOfIngedients: TIngredient[];
  ingredients: TIngredientWithKey[];
  ingredientsLoading: boolean;
  orderBurgerLoading: boolean;
  currentOrder: TOrder | null;
  feed: TOrdersData;
  feedLoading: boolean;
};

const initialState: TBurgerState = {
  listOfIngedients: [],
  ingredients: [],
  ingredientsLoading: false,
  orderBurgerLoading: false,
  currentOrder: null,
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  feedLoading: false
};

export const getIngerdients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

export const orderBurger = createAsyncThunk(
  'ingredients/order',
  async (data: TIngredientWithKey[]) => orderBurgerApi(data.map((i) => i._id))
);

export const getFeed = createAsyncThunk('feed/getAll', async () =>
  getFeedsApi()
);

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredientWithKey>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, key } };
      }
    },
    removeIngredient: (state, action: PayloadAction<TIngredientWithKey>) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.key !== action.payload.key
      );
    },
    setNewOrder: (state, action: PayloadAction<TOrder>) => {
      // state.order = action.payload;
    }
  },
  selectors: {
    burgersState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngerdients.pending, (state) => {
        state.ingredientsLoading = true;
      })
      .addCase(getIngerdients.fulfilled, (state, action) => {
        state.listOfIngedients = action.payload;
        state.ingredientsLoading = false;
      })
      .addCase(orderBurger.pending, (state) => {
        state.orderBurgerLoading = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderBurgerLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getFeed.pending, (state) => {
        state.feedLoading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.feed = action.payload;
        state.feedLoading = false;
      });
  }
});

export const { addIngredient, removeIngredient, setNewOrder } =
  burgerSlice.actions;
export const { burgersState } = burgerSlice.selectors;
