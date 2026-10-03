import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeStore } from '@/store';
import * as authApi from '@/features/auth/api/authApi';
import * as userApi from '@/features/users/api/userApi';
import * as postApi from '@/features/posts/api/postApi';
import * as tools from '@/helpers/toolsHelper';
import * as authA from '@/features/auth/states/action';
import * as usersA from '@/features/users/states/action';
import * as postsA from '@/features/posts/states/action';

vi.mock('@/features/auth/api/authApi');
vi.mock('@/features/users/api/userApi');
vi.mock('@/features/posts/api/postApi');
vi.mock('@/helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn().mockResolvedValue({}),
  showErrorDialog: vi.fn().mockResolvedValue({}),
  showWarningDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));

const err = Object.assign(new Error('boom'), {});
const file = new File(['x'], 'x.png');
const A = (m: any) => m as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('auth actions', () => {
  it('login sukses menyimpan token', async () => {
    A(authApi.login).mockResolvedValue({ data: { token: 'T' } });
    const store = makeStore();
    await store.dispatch(authA.asyncSetIsAuthLogin({ email: 'a', password: 'b' }) as any);
    expect(localStorage.getItem('accessToken')).toBe('T');
    expect(store.getState().auth.isAuthLogin).toBe(false);
    expect(tools.showSuccessDialog).toHaveBeenCalled();
  });

  it('login gagal menampilkan error', async () => {
    A(authApi.login).mockRejectedValue(err);
    const store = makeStore();
    await expect(store.dispatch(authA.asyncSetIsAuthLogin({ email: 'a', password: 'b' }) as any)).rejects.toThrow('boom');
    expect(tools.showErrorDialog).toHaveBeenCalledWith('Gagal login', 'boom');
  });

  it('register sukses dan gagal', async () => {
    const store = makeStore();
    A(authApi.register).mockResolvedValue({});
    await store.dispatch(authA.asyncSetIsAuthRegister({ name: 'n', email: 'e', password: 'p' }) as any);
    expect(tools.showSuccessDialog).toHaveBeenCalled();
    A(authApi.register).mockRejectedValue(err);
    await expect(
      store.dispatch(authA.asyncSetIsAuthRegister({ name: 'n', email: 'e', password: 'p' }) as any)
    ).rejects.toThrow();
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('logout selalu menghapus token', async () => {
    localStorage.setItem('accessToken', 'T');
    const store = makeStore();
    A(authApi.logout).mockRejectedValue(err);
    await store.dispatch(authA.asyncSetIsAuthLogout() as any);
    expect(localStorage.getItem('accessToken')).toBeNull();
    localStorage.setItem('accessToken', 'T');
    A(authApi.logout).mockResolvedValue({});
    await store.dispatch(authA.asyncSetIsAuthLogout() as any);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});

describe('users actions', () => {
  it('asyncGetUsers', async () => {
    const store = makeStore();
    A(userApi.getUsers).mockResolvedValue({ data: { users: [{ id: 1 }] } });
    await store.dispatch(usersA.asyncGetUsers() as any);
    expect(store.getState().users.users).toHaveLength(1);
    A(userApi.getUsers).mockResolvedValue({ data: {} });
    await store.dispatch(usersA.asyncGetUsers() as any);
    expect(store.getState().users.users).toEqual([]);
    A(userApi.getUsers).mockRejectedValue(err);
    await store.dispatch(usersA.asyncGetUsers() as any);
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('asyncGetProfile', async () => {
    const store = makeStore();
    A(userApi.getProfile).mockResolvedValue({ data: { user: { id: 5 } } });
    const u = await store.dispatch(usersA.asyncGetProfile() as any);
    expect(u.id).toBe(5);
    expect(store.getState().users.profile.id).toBe(5);
    A(userApi.getProfile).mockRejectedValue(err);
    await expect(store.dispatch(usersA.asyncGetProfile() as any)).rejects.toThrow();
    expect(store.getState().users.profile).toBeNull();
  });

  it('asyncChangeProfile', async () => {
    const store = makeStore();
    A(userApi.updateProfile).mockResolvedValue({ data: { user: { id: 1, name: 'N' } } });
    await store.dispatch(usersA.asyncChangeProfile({ name: 'N', email: 'e' }) as any);
    expect(store.getState().users.profile.name).toBe('N');
    A(userApi.updateProfile).mockRejectedValue(err);
    await expect(store.dispatch(usersA.asyncChangeProfile({ name: 'N', email: 'e' }) as any)).rejects.toThrow();
  });

  it('asyncChangeProfilePhoto', async () => {
    const store = makeStore();
    A(userApi.changePhoto).mockResolvedValue({});
    A(userApi.getProfile).mockResolvedValue({ data: { user: { id: 9 } } });
    await store.dispatch(usersA.asyncChangeProfilePhoto(file) as any);
    expect(store.getState().users.profile.id).toBe(9);
    A(userApi.changePhoto).mockRejectedValue(err);
    await expect(store.dispatch(usersA.asyncChangeProfilePhoto(file) as any)).rejects.toThrow();
  });

  it('asyncChangeProfilePassword', async () => {
    const store = makeStore();
    const p = { password: 'a', new_password: 'b', new_password_confirmation: 'b' };
    A(userApi.changePassword).mockResolvedValue({});
    await store.dispatch(usersA.asyncChangeProfilePassword(p) as any);
    expect(tools.showSuccessDialog).toHaveBeenCalled();
    A(userApi.changePassword).mockRejectedValue(err);
    await expect(store.dispatch(usersA.asyncChangeProfilePassword(p) as any)).rejects.toThrow();
  });
});

describe('posts actions', () => {
  it('asyncGetPosts', async () => {
    const store = makeStore();
    A(postApi.getPosts).mockResolvedValue({ data: { posts: [{ id: 1 }] } });
    await store.dispatch(postsA.asyncGetPosts() as any);
    expect(store.getState().posts.posts).toHaveLength(1);
    A(postApi.getPosts).mockResolvedValue({ data: {} });
    await store.dispatch(postsA.asyncGetPosts({ is_me: 1 }) as any);
    expect(store.getState().posts.posts).toEqual([]);
    A(postApi.getPosts).mockRejectedValue(err);
    await store.dispatch(postsA.asyncGetPosts() as any);
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('asyncGetPostById', async () => {
    const store = makeStore();
    A(postApi.getPostById).mockResolvedValue({ data: { post: { id: 3 } } });
    const p = await store.dispatch(postsA.asyncGetPostById(3) as any);
    expect(p.id).toBe(3);
    A(postApi.getPostById).mockRejectedValue(err);
    await expect(store.dispatch(postsA.asyncGetPostById(3) as any)).rejects.toThrow();
    expect(store.getState().posts.post).toBeNull();
  });

  const crud: [string, () => any, any, string][] = [
    ['asyncAddPost', () => postsA.asyncAddPost({ description: 'd' }), postApi.addPost, 'isPostAdded'],
    ['asyncChangePost', () => postsA.asyncChangePost(1, { description: 'd' }), postApi.updatePost, 'isPostChanged'],
    ['asyncChangePostCover', () => postsA.asyncChangePostCover(1, file), postApi.changeCover, 'isPostChangedCover'],
    ['asyncDeletePost', () => postsA.asyncDeletePost(1), postApi.deletePost, 'isPostDeleted'],
    ['asyncLikePost', () => postsA.asyncLikePost(1), postApi.likePost, 'isPostLiked'],
  ];

  it.each(crud)('%s sukses dan gagal', async (_n, make, api, flag) => {
    const store = makeStore();
    A(api).mockResolvedValue({});
    await store.dispatch(make());
    expect((store.getState().posts as any)[flag]).toBe(true);
    A(api).mockRejectedValue(err);
    await expect(store.dispatch(make())).rejects.toThrow('boom');
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('asyncAddComment dan asyncDeleteComment', async () => {
    const store = makeStore();
    A(postApi.addComment).mockResolvedValue({});
    A(postApi.deleteComment).mockResolvedValue({});
    A(postApi.getPostById).mockResolvedValue({ data: { post: { id: 1 } } });
    await store.dispatch(postsA.asyncAddComment(1, 'hai') as any);
    await store.dispatch(postsA.asyncDeleteComment(1, 2) as any);
    expect(store.getState().posts.post.id).toBe(1);
    A(postApi.addComment).mockRejectedValue(err);
    A(postApi.deleteComment).mockRejectedValue(err);
    await expect(store.dispatch(postsA.asyncAddComment(1, 'hai') as any)).rejects.toThrow();
    await expect(store.dispatch(postsA.asyncDeleteComment(1, 2) as any)).rejects.toThrow();
  });
});
