import { describe, it, expect } from 'vitest';
import authReducer from './reducer';
import { ActionType } from './action';

describe('authReducer', () => {
  it('SET_IS_AUTH_LOGIN', () => {
    const state = authReducer(undefined, {
      type: ActionType.SET_IS_AUTH_LOGIN,
      payload: { isAuthLogin: true },
    });
    expect(state.isAuthLogin).toBe(true);
  });
});
