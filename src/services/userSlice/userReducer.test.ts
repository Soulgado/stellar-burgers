import { describe, expect, test } from '@jest/globals';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  TUserState,
  updateUser,
  userReducer
} from './userReducer';

describe('testing async actions', () => {
  const mockUser = {
    email: 'user@example.com',
    name: 'user'
  };

  const mockRefreshToken = 'testRefreshToken';
  const mockAccessToken = 'testAccessToken';

  const userInitialState: TUserState = {
    user: null
  };

  test('register user thunk returns correct data', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: {
        user: mockUser,
        refreshToken: mockRefreshToken,
        accessToken: mockAccessToken
      }
    };

    const state = userReducer(userInitialState, action);
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

    const state = userReducer(userInitialState, action);
    expect(state.user).toBe(mockUser);
  });

  test('getUser thunk returns correct data', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: {
        user: mockUser
      }
    };

    const state = userReducer(userInitialState, action);
    expect(state.user).toBe(mockUser);
  });

  test('updateUser thunk returns correct data', () => {
    userInitialState.user = mockUser;

    const action = {
      type: updateUser.fulfilled.type,
      payload: {
        user: {
          ...mockUser,
          name: 'admin'
        }
      }
    };

    const state = userReducer(userInitialState, action);
    expect(state.user).toEqual({ ...mockUser, name: 'admin' });
  });

  test('logout action returns resets user data', () => {
    userInitialState.user = mockUser;

    const action = {
      type: logoutUser.fulfilled.type
    };

    const state = userReducer(userInitialState, action);
    expect(state.user).toEqual(null);
  });
});
