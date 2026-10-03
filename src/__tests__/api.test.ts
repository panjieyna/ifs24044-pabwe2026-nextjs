import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as helper from '@/helpers/apiHelper';
import * as authApi from '@/features/auth/api/authApi';
import * as userApi from '@/features/users/api/userApi';
import * as postApi from '@/features/posts/api/postApi';

vi.mock('@/helpers/apiHelper', () => ({
  apiFetch: vi.fn().mockResolvedValue({ status: 'success' }),
}));

const apiFetch = helper.apiFetch as any;
const file = new File(['x'], 'x.png', { type: 'image/png' });

describe('authApi', () => {
  beforeEach(() => apiFetch.mockClear());
  it('login, register, logout', async () => {
    await authApi.login({ email: 'a', password: 'b' });
    await authApi.register({ name: 'n', email: 'a', password: 'b' });
    await authApi.logout();
    expect(apiFetch.mock.calls.map((c: any[]) => c[0])).toEqual(['/auth/login', '/auth/register', '/auth/logout']);
    expect(apiFetch.mock.calls[0][1].auth).toBe(false);
  });
});

describe('userApi', () => {
  beforeEach(() => apiFetch.mockClear());
  it('semua endpoint user', async () => {
    await userApi.getUsers();
    await userApi.getProfile();
    await userApi.updateProfile({ name: 'a', email: 'b' });
    await userApi.changePhoto(file);
    await userApi.changePassword({ password: 'a', new_password: 'b', new_password_confirmation: 'b' });
    expect(apiFetch.mock.calls.map((c: any[]) => c[0])).toEqual([
      '/users',
      '/users/me',
      '/users/me',
      '/users/me/photo',
      '/users/password',
    ]);
    expect(apiFetch.mock.calls[3][1].body).toBeInstanceOf(FormData);
  });
});

describe('postApi', () => {
  beforeEach(() => apiFetch.mockClear());
  it('semua endpoint post', async () => {
    await postApi.getPosts();
    await postApi.getPosts({ is_me: 1 });
    await postApi.getPostById(1);
    await postApi.addPost({ description: 'd' });
    await postApi.updatePost(1, { description: 'd' });
    await postApi.changeCover(1, file);
    await postApi.deletePost(1);
    await postApi.likePost(1);
    await postApi.addComment(1, { comment: 'c' });
    await postApi.deleteComment(1, 2);
    await postApi.deleteAllPosts();
    expect(apiFetch.mock.calls.map((c: any[]) => c[0])).toEqual([
      '/posts',
      '/posts',
      '/posts/1',
      '/posts',
      '/posts/1',
      '/posts/1/cover',
      '/posts/1',
      '/posts/1/likes',
      '/posts/1/comments',
      '/posts/1/comments/2',
      '/posts',
    ]);
  });
});
