import { describe, expect, test } from '@jest/globals';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userReducer,
  initialState
} from './userReducer';

describe('testing async actions', () => {
  const mockUser = {
    email: 'user@example.com',
    name: 'user'
  };

  const mockRefreshToken = 'testRefreshToken';
  const mockAccessToken = 'testAccessToken';

  test('register user thunk returns correct data', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: {
        user: mockUser,
        refreshToken: mockRefreshToken,
        accessToken: mockAccessToken
      }
    };

    const state = userReducer(initialState, action);
    expect(state.user).toBe(mockUser);
  });

  test('login user thunk returns correct data', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: {
        user: mockUser,
        refreshToken: mockRefreshToken,
        accessToken: mockAccessToken
      }
    };

    const state = userReducer(initialState, action);
    expect(state.user).toBe(mockUser);
  });

  test('getUser thunk returns correct data', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: {
        user: mockUser
      }
    };

    const state = userReducer(initialState, action);
    expect(state.user).toBe(mockUser);
  });

  test('updateUser thunk returns correct data', () => {
    const prepareAction = {
      type: getUser.fulfilled.type,
      payload: {
        user: mockUser
      }
    };

    const state = userReducer(initialState, prepareAction);

    const action = {
      type: updateUser.fulfilled.type,
      payload: {
        user: {
          ...mockUser,
          name: 'admin'
        }
      }
    };

    const finalState = userReducer(state, action);
    expect(finalState.user).toEqual({ ...mockUser, name: 'admin' });
  });

  test('logout action returns resets user data', () => {
    const prepareAction = {
      type: getUser.fulfilled.type,
      payload: {
        user: mockUser
      }
    };

    const state = userReducer(initialState, prepareAction);

    const action = {
      type: logoutUser.fulfilled.type
    };

    const finalState = userReducer(state, action);
    expect(finalState.user).toEqual(null);
  });
});
