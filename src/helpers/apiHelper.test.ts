import { describe, it, expect, beforeEach } from 'vitest';
import { getAccessToken, putAccessToken, removeAccessToken } from './apiHelper';

describe('apiHelper token utils', () => {
  beforeEach(() => localStorage.clear());

  it('stores and reads token', () => {
    putAccessToken('abc');
    expect(getAccessToken()).toBe('abc');
  });

  it('removes token', () => {
    putAccessToken('abc');
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});
