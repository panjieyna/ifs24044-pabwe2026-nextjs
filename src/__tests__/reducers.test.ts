import { describe, it, expect } from 'vitest';
import authReducer from '@/features/auth/states/reducer';
import usersReducer from '@/features/users/states/reducer';
import postsReducer from '@/features/posts/states/reducer';
import * as authA from '@/features/auth/states/action';
import * as usersA from '@/features/users/states/action';
import * as postsA from '@/features/posts/states/action';
import { makeStore } from '@/store';

describe('authReducer', () => {
  it('menangani semua action', () => {
    let s: any = authReducer(undefined, {});
    s = authReducer(s, authA.setIsAuthLogin(true));
    s = authReducer(s, authA.setIsAuthRegister(true));
    s = authReducer(s, authA.setIsAuthLogout(true));
    expect(s).toEqual({ isAuthLogin: true, isAuthRegister: true, isAuthLogout: true });
    expect(authReducer(s, { type: 'X' })).toBe(s);
  });
});

describe('usersReducer', () => {
  it('menangani semua action', () => {
    let s: any = usersReducer(undefined, {});
    s = usersReducer(s, usersA.setUsers([{ id: 1 }]));
    s = usersReducer(s, usersA.setProfile({ id: 2 }));
    s = usersReducer(s, usersA.setIsProfile(true));
    s = usersReducer(s, usersA.setIsChangeProfile(true));
    s = usersReducer(s, usersA.setIsChangeProfilePhoto(true));
    s = usersReducer(s, usersA.setIsChangeProfilePassword(true));
    expect(s.users).toHaveLength(1);
    expect(s.profile.id).toBe(2);
    expect(s.isProfile && s.isChangeProfile && s.isChangeProfilePhoto && s.isChangeProfilePassword).toBe(true);
    expect(usersReducer(s, { type: 'X' })).toBe(s);
  });
});

describe('postsReducer', () => {
  it('menangani semua action', () => {
    let s: any = postsReducer(undefined, {});
    const actions = [
      postsA.setPosts([{ id: 1 }]),
      postsA.setPost({ id: 1 }),
      postsA.setIsPost(true),
      postsA.setIsPostAdd(true),
      postsA.setIsPostAdded(true),
      postsA.setIsPostChange(true),
      postsA.setIsPostChanged(true),
      postsA.setIsPostChangeCover(true),
      postsA.setIsPostChangedCover(true),
      postsA.setIsPostDelete(true),
      postsA.setIsPostDeleted(true),
      postsA.setIsPostLike(true),
      postsA.setIsPostLiked(true),
    ];
    actions.forEach((a) => (s = postsReducer(s, a)));
    expect(s.posts).toHaveLength(1);
    expect(s.post.id).toBe(1);
    const flags = Object.entries(s).filter(([k]) => k.startsWith('isPost'));
    expect(flags.every(([, v]) => v === true)).toBe(true);
    expect(postsReducer(s, { type: 'X' })).toBe(s);
  });
});

describe('store', () => {
  it('makeStore menggabungkan semua reducer', () => {
    const store = makeStore();
    expect(Object.keys(store.getState())).toEqual(['auth', 'users', 'posts']);
  });
});
